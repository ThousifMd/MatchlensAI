require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 5001;

// Database pool with simplified config
let pool = null;
try {
    pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_HOST?.includes('digitalocean') ? { rejectUnauthorized: false } : false,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    })
} catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
}

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get(['/', '/health'], (req, res) => res.status(200).send('OK'));

// Helper function to upload images
async function uploadImages(images, folder) {
    if (!Array.isArray(images) || images.length === 0) return [];

    const uploads = images.map(async (image) => {
        try {
            const imageData = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
            const result = await cloudinary.uploader.upload(imageData, {
                folder,
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto:good' }
                ]
            });
            return result.secure_url;
        } catch (error) {
            console.error('Image upload failed:', error.message);
            return null;
        }
    });

    const results = await Promise.all(uploads);
    return results.filter(Boolean); // Remove failed uploads
}

// Store payment and onboarding data
app.post('/api/payments/store', async (req, res) => {
    const {
        orderId, paymentId, amount, currency = 'USD', packageId, packageName,
        customerEmail, customerName, status, onboardingData
    } = req.body;

    // Validation
    if (!orderId || !paymentId || !amount || !customerEmail || status !== 'completed') {
        return res.status(400).json({
            success: false,
            message: 'Missing required payment fields or payment not completed'
        });
    }

    if (!onboardingData?.name || !onboardingData?.email) {
        return res.status(400).json({
            success: false,
            message: 'Missing onboarding data (name and email required)'
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Upload images in parallel
        const [originalUrls, screenshotUrls] = await Promise.all([
            uploadImages(onboardingData.originalPhotos || [], 'matchlens-onboarding-photos'),
            uploadImages(onboardingData.screenshotPhotos || [], 'matchlens-onboarding-screenshots')
        ]);

        // Insert onboarding data
        const onboardingResult = await client.query(`
            INSERT INTO onboarding_submissions (
                name, age, dating_goal, current_matches, body_type, style_preference,
                ethnicity, interests, current_bio, email, phone, weekly_tips,
                original_photos, screenshot_photos
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING user_id
        `, [
            onboardingData.name,
            onboardingData.age ? parseInt(onboardingData.age) : null,
            onboardingData.datingGoal,
            onboardingData.currentMatches,
            onboardingData.bodyType,
            onboardingData.stylePreference,
            onboardingData.ethnicity,
            JSON.stringify(onboardingData.interests || []),
            onboardingData.currentBio || '',
            onboardingData.email,
            onboardingData.phone || '',
            onboardingData.weeklyTips || false,
            JSON.stringify(originalUrls),
            JSON.stringify(screenshotUrls)
        ]);

        const userId = onboardingResult.rows[0].user_id;

        // Insert payment data
        const paymentResult = await client.query(`
            INSERT INTO payments (
                user_id, order_id, paypal_payment_id, amount, currency, package_id,
                package_name, customer_email, customer_name, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING payment_id
        `, [
            userId, orderId, paymentId, amount, currency, packageId,
            packageName, customerEmail, customerName, status
        ]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Data stored successfully',
            userId,
            paymentId: paymentResult.rows[0].payment_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Store payment error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to store data'
        });
    } finally {
        client.release();
    }
});

// Get payments list
app.get('/api/payments/list', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.payment_id, p.user_id, p.order_id, p.amount, p.currency,
                p.package_name, p.customer_email, p.customer_name, p.status,
                p.created_at as payment_created_at,
                o.name, o.age, o.email, o.dating_goal
            FROM payments p
            JOIN onboarding_submissions o ON p.user_id = o.user_id
            ORDER BY p.created_at DESC 
            LIMIT 100
        `);

        res.json({
            success: true,
            payments: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('List payments error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch payments' });
    }
});

// Get payment by order ID
app.get('/api/payments/order/:orderId', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.*, o.name, o.age, o.dating_goal, o.current_matches, o.body_type,
                o.style_preference, o.ethnicity, o.interests, o.current_bio,
                o.phone, o.weekly_tips, o.original_photos, o.screenshot_photos,
                o.created_at as onboarding_created_at
            FROM payments p
            JOIN onboarding_submissions o ON p.user_id = o.user_id
            WHERE p.order_id = $1
        `, [req.params.orderId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        res.json({ success: true, payment: result.rows[0] });
    } catch (error) {
        console.error('Get payment error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch payment' });
    }
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);

    const timeout = setTimeout(() => {
        console.log('Force exit timeout reached');
        process.exit(1);
    }, 10000);

    server.close(() => {
        console.log('HTTP server closed');
        pool.end(() => {
            console.log('Database pool closed');
            clearTimeout(timeout);
            process.exit(0);
        });
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));