const { query } = require('../config/database');

const setupPaymentsTable = async () => {
    try {
        console.log('🔧 Setting up payments table...');

        // Drop existing table if it exists (for development)
        await query('DROP TABLE IF EXISTS onboarding_submissions CASCADE');
        await query('DROP TABLE IF EXISTS payments CASCADE');

        // Create payments table
        await query(`
            CREATE TABLE payments (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(255) UNIQUE NOT NULL,
                payment_id VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                currency VARCHAR(10) NOT NULL DEFAULT 'USD',
                package_id VARCHAR(100),
                package_name VARCHAR(255),
                customer_email VARCHAR(255) NOT NULL,
                customer_name VARCHAR(255),
                status VARCHAR(50) NOT NULL,
                onboarding_data JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create onboarding submissions table
        await query(`
            CREATE TABLE onboarding_submissions (
                id SERIAL PRIMARY KEY,
                payment_id INTEGER REFERENCES payments(id),
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
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Payments tables created successfully');

        // Test insert
        const testPayment = await query(`
            INSERT INTO payments (
                order_id, payment_id, amount, currency, package_id, package_name,
                customer_email, customer_name, status, onboarding_data
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            'test-' + Date.now(),
            'test-payment-' + Date.now(),
            1.00,
            'USD',
            'test-package',
            'Test Package',
            'test@example.com',
            'Test User',
            'completed',
            JSON.stringify({ test: 'data' })
        ]);

        console.log('✅ Test payment inserted:', testPayment.rows[0]);

        // Clean up test data
        await query('DELETE FROM payments WHERE order_id LIKE $1', ['test-%']);
        console.log('✅ Test data cleaned up');

    } catch (error) {
        console.error('❌ Error setting up payments table:', error);
        throw error;
    }
};

// Run setup if called directly
if (require.main === module) {
    setupPaymentsTable()
        .then(() => {
            console.log('✅ Payments setup completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Payments setup failed:', error);
            process.exit(1);
        });
}

module.exports = { setupPaymentsTable };
