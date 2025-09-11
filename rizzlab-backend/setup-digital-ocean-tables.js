const { Pool } = require("pg");
require("dotenv").config();

// Digital Ocean database connection
const digitalOceanPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDigitalOceanTables() {
  try {
    console.log('🚀 Setting up tables in Digital Ocean database...\n');
    
    // Create onboarding_submissions table
    console.log('📋 Creating onboarding_submissions table...');
    await digitalOceanPool.query(`
      CREATE TABLE IF NOT EXISTS onboarding_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age VARCHAR(10) NOT NULL,
        dating_goal VARCHAR(50) NOT NULL,
        current_matches VARCHAR(20) NOT NULL,
        body_type VARCHAR(50) NOT NULL,
        style_preference VARCHAR(50) NOT NULL,
        ethnicity VARCHAR(100),
        interests JSONB NOT NULL,
        current_bio TEXT,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        weekly_tips BOOLEAN DEFAULT true,
        original_photos JSONB,
        screenshot_photos JSONB,
        gender VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ onboarding_submissions table created successfully!');
    
    // Create index for onboarding_submissions
    await digitalOceanPool.query(`
      CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_created_at 
      ON onboarding_submissions(created_at);
    `);
    
    await digitalOceanPool.query(`
      CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_email 
      ON onboarding_submissions(email);
    `);
    
    // Create payments table
    console.log('\n💳 Creating payments table...');
    await digitalOceanPool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        payment_id VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        package_id VARCHAR(100),
        package_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'completed',
        onboarding_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ payments table created successfully!');
    
    // Create indexes for payments
    await digitalOceanPool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_created_at 
      ON payments(created_at);
    `);
    
    await digitalOceanPool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_customer_email 
      ON payments(customer_email);
    `);
    
    await digitalOceanPool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_order_id 
      ON payments(order_id);
    `);
    
    // Check existing data
    console.log('\n📊 Checking existing data...');
    
    const onboardingCount = await digitalOceanPool.query('SELECT COUNT(*) FROM onboarding_submissions');
    const paymentsCount = await digitalOceanPool.query('SELECT COUNT(*) FROM payments');
    
    console.log(`📋 onboarding_submissions: ${onboardingCount.rows[0].count} records`);
    console.log(`💳 payments: ${paymentsCount.rows[0].count} records`);
    
    // Show table structure
    console.log('\n📋 TABLE STRUCTURE:');
    const tablesResult = await digitalOceanPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('onboarding_submissions', 'payments')
      ORDER BY table_name;
    `);
    
    console.log('Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    console.log('\n🎉 Digital Ocean database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up Digital Ocean tables:', error);
  } finally {
    await digitalOceanPool.end();
  }
}

setupDigitalOceanTables();
