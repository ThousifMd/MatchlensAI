const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function setupTables() {
    try {
        console.log('🔗 Connecting to database...');

        // Test connection first
        const dbInfo = await pool.query('SELECT current_database(), current_schema();');
        console.log('✅ Connected to:', dbInfo.rows[0].current_database);
        console.log('📁 Schema:', dbInfo.rows[0].current_schema);

        // Create onboarding_submissions table
        console.log('\n📋 Creating onboarding_submissions table...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS onboarding_submissions (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        age VARCHAR(50),
        dating_goal VARCHAR(100),
        current_matches VARCHAR(50),
        body_type VARCHAR(100),
        style_preference VARCHAR(100),
        ethnicity VARCHAR(100),
        interests TEXT[],
        current_bio TEXT,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        photo_count INTEGER DEFAULT 0,
        screenshot_count INTEGER DEFAULT 0,
        vibe VARCHAR(100),
        want_more VARCHAR(100),
        one_liner TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log('✅ onboarding_submissions table created');

        // Create payments table
        console.log('\n💳 Creating payments table...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        package_id VARCHAR(100),
        package_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        onboarding_data JSONB,
        paypal_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log('✅ payments table created');

        // Check table counts
        console.log('\n📊 Table status:');
        const onboardingCount = await pool.query('SELECT COUNT(*) as count FROM onboarding_submissions');
        const paymentsCount = await pool.query('SELECT COUNT(*) as count FROM payments');

        console.log(`📋 onboarding_submissions: ${onboardingCount.rows[0].count} records`);
        console.log(`💳 payments: ${paymentsCount.rows[0].count} records`);

        console.log('\n🎉 Database setup complete!');
        await pool.end();

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        await pool.end();
        process.exit(1);
    }
}

setupTables();
