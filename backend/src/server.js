// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env.local' });
}

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5001;

// Optimized database pool configuration
let pool = null;
try {
    pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_HOST?.includes('digitalocean') ? { rejectUnauthorized: false } : false,
        max: 10, // Increased for better concurrency
        min: 2,  // Keep minimum connections
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        acquireTimeoutMillis: 10000,
        statement_timeout: 30000,
        query_timeout: 30000,
    });
    
    // Test connection on startup
    pool.on('connect', () => console.log('✅ Database connected'));
    pool.on('error', (err) => console.error('❌ Database pool error:', err));
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

// Optimized middleware stack
app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get(['/', '/health'], (req, res) => res.status(200).send('OK'));

// Optimized image upload function with better error handling and performance
async function uploadImages(images, folder) {
    if (!Array.isArray(images) || images.length === 0) return [];

    // Process images in batches to avoid overwhelming Cloudinary
    const batchSize = 3;
    const results = [];
    
    for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize);
        
        const uploads = batch.map(async (image, index) => {
            try {
                // Validate image data
                if (!image || typeof image !== 'string') {
                    console.warn(`Invalid image data at index ${i + index}`);
                    return null;
                }
                
                const imageData = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
                
                const result = await cloudinary.uploader.upload(imageData, {
                    folder,
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto:good' },
                        { format: 'auto' } // Auto-optimize format
                    ],
                    timeout: 30000, // 30 second timeout
                    resource_type: 'auto'
                });
                
                console.log(`✅ Uploaded image ${i + index + 1}/${images.length} to ${result.secure_url}`);
                return result.secure_url;
            } catch (error) {
                console.error(`❌ Image upload failed for batch ${i + index}:`, error.message);
                return null;
            }
        });
        
        const batchResults = await Promise.all(uploads);
        results.push(...batchResults.filter(Boolean));
    }
    
    return results;
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
    const startTime = Date.now();

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
        
        const processingTime = Date.now() - startTime;
        console.log(`✅ Transaction completed in ${processingTime}ms`);

        res.json({
            success: true,
            message: 'Data stored successfully',
            userId,
            paymentId: paymentResult.rows[0].payment_id,
            processingTime: `${processingTime}ms`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Store payment error:', {
            message: error.message,
            stack: error.stack,
            processingTime: `${Date.now() - startTime}ms`
        });
        res.status(500).json({
            success: false,
            message: 'Failed to store data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    } finally {
        client.release(); // Always release the connection
    }
});

// Optimized payments list endpoint with pagination and caching
app.get('/api/payments/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 per page
        const offset = (page - 1) * limit;
        
        // Get total count and payments in parallel
        const [countResult, paymentsResult] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM payments'),
            pool.query(`
                SELECT 
                    p.payment_id, p.user_id, p.order_id, p.amount, p.currency,
                    p.package_name, p.customer_email, p.customer_name, p.status,
                    p.created_at as payment_created_at,
                    o.name, o.age, o.email, o.dating_goal
                FROM payments p
                JOIN onboarding_submissions o ON p.user_id = o.user_id
                ORDER BY p.created_at DESC 
                LIMIT $1 OFFSET $2
            `, [limit, offset])
        ]);
        
        const totalCount = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            success: true,
            payments: paymentsResult.rows,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('❌ List payments error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch payments',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Optimized payment lookup with better error handling
app.get('/api/payments/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Validate orderId format
        if (!orderId || typeof orderId !== 'string' || orderId.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid order ID format' 
            });
        }
        
        const result = await pool.query(`
            SELECT 
                p.*, o.name, o.age, o.dating_goal, o.current_matches, o.body_type,
                o.style_preference, o.ethnicity, o.interests, o.current_bio,
                o.phone, o.weekly_tips, o.original_photos, o.screenshot_photos,
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
        console.error('❌ Get payment error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch payment',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Enhanced error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler with better logging
app.use('*', (req, res) => {
    console.warn(`⚠️ 404 - ${req.method} ${req.url} not found`);
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found',
        path: req.url,
        method: req.method
    });
});

// Start server with enhanced logging
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 Database: ${process.env.DB_HOST ? 'Connected' : 'Not configured'}`);
    console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}`);
});

// Enhanced graceful shutdown with better error handling
const gracefulShutdown = (signal) => {
    console.log(`\n🛑 ${signal} received, shutting down gracefully...`);
    
    const startTime = Date.now();
    const timeout = setTimeout(() => {
        console.log('⏰ Force exit timeout reached (15s)');
        process.exit(1);
    }, 15000); // Increased timeout

    server.close((err) => {
        if (err) {
            console.error('❌ Error closing HTTP server:', err);
        } else {
            console.log('✅ HTTP server closed');
        }
        
        if (pool) {
            pool.end((err) => {
                if (err) {
                    console.error('❌ Error closing database pool:', err);
                } else {
                    console.log('✅ Database pool closed');
                }
                
                const shutdownTime = Date.now() - startTime;
                console.log(`⏱️  Shutdown completed in ${shutdownTime}ms`);
                clearTimeout(timeout);
                process.exit(0);
            });
        } else {
            clearTimeout(timeout);
            process.exit(0);
        }
    });
};

// Handle various shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // For nodemon

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
});