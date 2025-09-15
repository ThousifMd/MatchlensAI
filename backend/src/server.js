require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('digitalocean') ? { rejectUnauthorized: false } : false,
    max: 2, // Reduced pool size
    idleTimeoutMillis: 10000, // Reduced timeout
    connectionTimeoutMillis: 3000, // Reduced timeout
    acquireTimeoutMillis: 3000, // Add acquire timeout
});

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check - MUST be first and simple
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// Upload images to Cloudinary
async function uploadImagesToCloudinary(images, folder) {
    const uploadedUrls = [];

    if (!images || !Array.isArray(images)) {
        return uploadedUrls;
    }

    for (const imageData of images) {
        try {
            let uploadData = imageData;
            if (typeof imageData === 'string' && !imageData.startsWith('data:')) {
                uploadData = `data:image/jpeg;base64,${imageData}`;
            }

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload(
                    uploadData,
                    {
                        folder: folder,
                        resource_type: 'auto',
                        transformation: [
                            { width: 800, height: 800, crop: 'limit' },
                            { quality: 'auto:good' }
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });

            uploadedUrls.push(result.secure_url);
        } catch (error) {
            console.error('Cloudinary upload error:', error.message);
        }
    }

    return uploadedUrls;
}

// Store payment and onboarding data
app.post('/api/payments/store', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
    } catch (error) {
        console.error('Failed to get database client:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }

    try {
        const {
            orderId,
            paymentId,
            amount,
            currency,
            packageId,
            packageName,
            customerEmail,
            customerName,
            status,
            onboardingData
        } = req.body;

        // Validate required fields
        if (!orderId || !paymentId || !amount || !customerEmail || status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields or payment not completed'
            });
        }

        if (!onboardingData || !onboardingData.name || !onboardingData.email) {
            return res.status(400).json({
                success: false,
                message: 'Missing onboarding data'
            });
        }

        // Upload images to Cloudinary
        const originalPhotoUrls = await uploadImagesToCloudinary(
            onboardingData.originalPhotos || [],
            'matchlens-onboarding-photos'
        );

        const screenshotPhotoUrls = await uploadImagesToCloudinary(
            onboardingData.screenshotPhotos || [],
            'matchlens-onboarding-screenshots'
        );

        // Start transaction
        await client.query('BEGIN');

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
            JSON.stringify(originalPhotoUrls),
            JSON.stringify(screenshotPhotoUrls)
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
            userId,
            orderId,
            paymentId,
            amount,
            currency || 'USD',
            packageId,
            packageName,
            customerEmail,
            customerName,
            status
        ]);

        // Commit transaction
        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Data stored successfully',
            userId: userId,
            paymentId: paymentResult.rows[0].payment_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error storing data:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to store data',
            error: error.message
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
                p.payment_id,
                p.user_id,
                p.order_id,
                p.paypal_payment_id,
                p.amount,
                p.currency,
                p.package_id,
                p.package_name,
                p.customer_email,
                p.customer_name,
                p.status,
                p.created_at as payment_created_at,
                o.name,
                o.age,
                o.email,
                o.dating_goal
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
        console.error('Error fetching payments:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payments'
        });
    }
});

// Get payment by order ID
app.get('/api/payments/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await pool.query(`
            SELECT 
                p.payment_id,
                p.user_id,
                p.order_id,
                p.paypal_payment_id,
                p.amount,
                p.currency,
                p.package_id,
                p.package_name,
                p.customer_email,
                p.customer_name,
                p.status,
                p.created_at as payment_created_at,
                o.name,
                o.age,
                o.dating_goal,
                o.current_matches,
                o.body_type,
                o.style_preference,
                o.ethnicity,
                o.interests,
                o.current_bio,
                o.phone,
                o.weekly_tips,
                o.original_photos,
                o.screenshot_photos,
                o.created_at as onboarding_created_at
            FROM payments p
            JOIN onboarding_submissions o ON p.user_id = o.user_id
            WHERE p.order_id = $1
        `, [orderId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            payment: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching payment:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment'
        });
    }
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Test database connection on startup
async function testDatabaseConnection() {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

// Start server
const server = app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    await testDatabaseConnection();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    
    // Set a timeout to force exit if graceful shutdown takes too long
    const forceExit = setTimeout(() => {
        console.log('Force exiting due to timeout');
        process.exit(1);
    }, 10000); // 10 second timeout
    
    server.close(() => {
        console.log('HTTP server closed');
        pool.end(() => {
            console.log('Database pool closed');
            clearTimeout(forceExit);
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    
    const forceExit = setTimeout(() => {
        console.log('Force exiting due to timeout');
        process.exit(1);
    }, 10000);
    
    server.close(() => {
        console.log('HTTP server closed');
        pool.end(() => {
            console.log('Database pool closed');
            clearTimeout(forceExit);
            process.exit(0);
        });
    });
});