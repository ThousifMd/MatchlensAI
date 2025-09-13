const { query } = require('../config/database');

const setupUpdatedSchema = async () => {
    try {
        console.log('🔧 Setting up updated database schema...');

        // Drop existing tables if they exist (for development)
        await query('DROP TABLE IF EXISTS payments CASCADE');
        await query('DROP TABLE IF EXISTS onboarding_submissions CASCADE');

        // Create onboarding_submissions table with user_id as primary key
        await query(`
            CREATE TABLE onboarding_submissions (
                user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                age INTEGER,
                dating_goal VARCHAR(255),
                current_matches VARCHAR(255),
                body_type VARCHAR(255),
                style_preference VARCHAR(255),
                ethnicity VARCHAR(255),
                interests JSONB,
                current_bio TEXT,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                weekly_tips BOOLEAN DEFAULT false,
                original_photos JSONB,
                screenshot_photos JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create payments table with payment_id as primary key and user_id as foreign key
        await query(`
            CREATE TABLE payments (
                payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES onboarding_submissions(user_id) ON DELETE CASCADE,
                order_id VARCHAR(255) UNIQUE NOT NULL,
                paypal_payment_id VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                currency VARCHAR(10) NOT NULL DEFAULT 'USD',
                package_id VARCHAR(100),
                package_name VARCHAR(255),
                customer_email VARCHAR(255) NOT NULL,
                customer_name VARCHAR(255),
                status VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Updated schema created successfully');

        // Test the relationship
        console.log('🧪 Testing the new schema...');

        // Insert test onboarding data
        const onboardingResult = await query(`
            INSERT INTO onboarding_submissions (
                name, age, dating_goal, current_matches, body_type, style_preference,
                ethnicity, interests, current_bio, email, phone, weekly_tips,
                original_photos, screenshot_photos
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING user_id
        `, [
            'Test User',
            25,
            'serious_relationship',
            '0-5',
            'athletic',
            'casual',
            'asian',
            JSON.stringify(['photography', 'travel', 'fitness']),
            'Test bio',
            'test@example.com',
            '1234567890',
            true,
            JSON.stringify(['photo1.jpg', 'photo2.jpg']),
            JSON.stringify(['screenshot1.jpg', 'screenshot2.jpg'])
        ]);

        const userId = onboardingResult.rows[0].user_id;
        console.log('✅ Test onboarding data inserted with user_id:', userId);

        // Insert test payment data
        const paymentResult = await query(`
            INSERT INTO payments (
                user_id, order_id, paypal_payment_id, amount, currency, package_id,
                package_name, customer_email, customer_name, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING payment_id
        `, [
            userId,
            'test-order-' + Date.now(),
            'test-paypal-' + Date.now(),
            1.00,
            'USD',
            'professional',
            'Professional Package',
            'test@example.com',
            'Test User',
            'completed'
        ]);

        const paymentId = paymentResult.rows[0].payment_id;
        console.log('✅ Test payment data inserted with payment_id:', paymentId);

        // Verify the relationship works
        const relationshipTest = await query(`
            SELECT 
                o.user_id,
                o.name,
                o.email,
                p.payment_id,
                p.order_id,
                p.amount,
                p.status
            FROM onboarding_submissions o
            JOIN payments p ON o.user_id = p.user_id
            WHERE o.user_id = $1
        `, [userId]);

        console.log('✅ Relationship test successful:', relationshipTest.rows[0]);

        // Clean up test data
        await query('DELETE FROM payments WHERE payment_id = $1', [paymentId]);
        await query('DELETE FROM onboarding_submissions WHERE user_id = $1', [userId]);
        console.log('✅ Test data cleaned up');

    } catch (error) {
        console.error('❌ Error setting up updated schema:', error);
        throw error;
    }
};

// Run setup if called directly
if (require.main === module) {
    setupUpdatedSchema()
        .then(() => {
            console.log('✅ Updated schema setup completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Updated schema setup failed:', error);
            process.exit(1);
        });
}

module.exports = { setupUpdatedSchema };
