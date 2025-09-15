const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
console.log('☁️ Cloudinary Config Debug:', {
    'cloud_name': process.env.CLOUDINARY_CLOUD_NAME,
    'api_key': process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_API_SECRET ? '***set***' : 'not set'
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (images, folder) => {
    const uploadedUrls = [];

    if (!images || !Array.isArray(images)) {
        return uploadedUrls;
    }

    for (const imageData of images) {
        try {
            // Handle both base64 data and file objects
            let uploadData = imageData;

            // If it's a file object with base64 data
            if (typeof imageData === 'object' && imageData.data) {
                uploadData = `data:${imageData.type || 'image/jpeg'};base64,${imageData.data}`;
            } else if (typeof imageData === 'string' && !imageData.startsWith('data:')) {
                // If it's just base64 data without data URL prefix
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
            console.log(`✅ Image uploaded to Cloudinary: ${result.secure_url}`);

        } catch (uploadError) {
            console.error('❌ Error uploading image to Cloudinary:', uploadError);
            // Continue with other images even if one fails
        }
    }

    return uploadedUrls;
};

// Store payment and onboarding data - ONLY AFTER PAYMENT SUCCESS
router.post('/store', async (req, res) => {
    try {
        console.log('🔄 Payment store request received:', req.body);

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
        if (!orderId || !paymentId || !amount || !customerEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment fields'
            });
        }

        // IMPORTANT: Only store questionnaire data if payment status is 'completed'
        if (status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment must be completed before storing questionnaire data'
            });
        }

        // Validate onboarding data
        if (!onboardingData || !onboardingData.name || !onboardingData.email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required onboarding data (name, email)'
            });
        }

        // Verify payment was successful before storing any data
        console.log('✅ Payment confirmed as completed - proceeding to store questionnaire data');

        // Upload images to Cloudinary first
        console.log('📸 Uploading images to Cloudinary...');
        console.log('🔍 Original photos data:', onboardingData.originalPhotos);
        console.log('🔍 Screenshot photos data:', onboardingData.screenshotPhotos);
        console.log('🔍 Original photos type:', typeof onboardingData.originalPhotos, 'Length:', onboardingData.originalPhotos?.length);
        console.log('🔍 Screenshot photos type:', typeof onboardingData.screenshotPhotos, 'Length:', onboardingData.screenshotPhotos?.length);

        const originalPhotoUrls = await uploadImagesToCloudinary(
            onboardingData.originalPhotos || [],
            'matchlens-onboarding-photos'
        );
        const screenshotPhotoUrls = await uploadImagesToCloudinary(
            onboardingData.screenshotPhotos || [],
            'matchlens-onboarding-screenshots'
        );

        console.log(`✅ Uploaded ${originalPhotoUrls.length} original photos and ${screenshotPhotoUrls.length} screenshot photos`);
        console.log('🔗 Original photo URLs:', originalPhotoUrls);
        console.log('🔗 Screenshot photo URLs:', screenshotPhotoUrls);

        // Start transaction - ONLY after payment success and image uploads
        const client = await require('../config/database').getClient();

        try {
            await client.query('BEGIN');

            // First, insert onboarding data and get user_id
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
                JSON.stringify(originalPhotoUrls), // Use Cloudinary URLs
                JSON.stringify(screenshotPhotoUrls) // Use Cloudinary URLs
            ]);

            const userId = onboardingResult.rows[0].user_id;
            console.log('✅ Onboarding data stored with user_id:', userId);

            // Then, insert payment data with user_id as foreign key
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

            const paymentIdResult = paymentResult.rows[0].payment_id;
            console.log('✅ Payment stored successfully with payment_id:', paymentIdResult);

            // Commit transaction
            await client.query('COMMIT');

            res.json({
                success: true,
                message: 'Payment successful - Questionnaire data stored successfully',
                userId: userId,
                paymentId: paymentIdResult,
                orderId: orderId
            });

        } catch (transactionError) {
            await client.query('ROLLBACK');
            throw transactionError;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('❌ Error storing payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to store payment',
            error: error.message
        });
    }
});

// Get payment by order ID with user details
router.get('/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await query(`
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
        console.error('❌ Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment',
            error: error.message
        });
    }
});

// Get payment by payment ID
router.get('/payment/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;

        const result = await query(`
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
            WHERE p.payment_id = $1
        `, [paymentId]);

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
        console.error('❌ Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment',
            error: error.message
        });
    }
});

// List all payments with user details
router.get('/list', async (req, res) => {
    try {
        const result = await query(`
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
        console.error('❌ Error listing payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list payments',
            error: error.message
        });
    }
});

// Get user by user ID with all payments
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Get user details
        const userResult = await query(
            'SELECT * FROM onboarding_submissions WHERE user_id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's payments
        const paymentsResult = await query(
            'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.json({
            success: true,
            user: userResult.rows[0],
            payments: paymentsResult.rows,
            paymentCount: paymentsResult.rows.length
        });

    } catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
});

module.exports = router;
