const { query, testConnection } = require('../config/database');
require('dotenv').config();

// SQL queries to create tables
const createTables = async () => {
    try {
        console.log('🔄 Setting up database tables...');

        // Create onboarding_submissions table
        const createOnboardingTable = `
      CREATE TABLE IF NOT EXISTS onboarding_submissions (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        age VARCHAR(50) NOT NULL,
        dating_goal VARCHAR(100) NOT NULL,
        current_matches VARCHAR(50) NOT NULL,
        body_type VARCHAR(100) NOT NULL,
        style_preference VARCHAR(100) NOT NULL,
        ethnicity VARCHAR(100) NOT NULL,
        interests TEXT[] NOT NULL,
        current_bio TEXT,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        weekly_tips BOOLEAN DEFAULT false,
        vibe VARCHAR(100),
        want_more VARCHAR(100),
        one_liner TEXT,
        original_photos TEXT[] DEFAULT '{}',
        screenshot_photos TEXT[] DEFAULT '{}',
        photo_count INTEGER DEFAULT 0,
        screenshot_count INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Create payments table
        const createPaymentsTable = `
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        payment_id VARCHAR(255) UNIQUE NOT NULL,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        submission_id VARCHAR(255) REFERENCES onboarding_submissions(submission_id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        package_id VARCHAR(100) NOT NULL,
        package_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        payment_method VARCHAR(50) DEFAULT 'paypal',
        status VARCHAR(50) DEFAULT 'pending',
        paypal_order_id VARCHAR(255),
        paypal_payer_id VARCHAR(255),
        paypal_payment_id VARCHAR(255),
        paypal_capture_id VARCHAR(255),
        paypal_details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Create users table (for future authentication)
        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        subscription_status VARCHAR(50) DEFAULT 'inactive',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Create photo_generations table (for tracking AI processing)
        const createPhotoGenerationsTable = `
      CREATE TABLE IF NOT EXISTS photo_generations (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(255) REFERENCES onboarding_submissions(submission_id) ON DELETE CASCADE,
        payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'queued',
        original_photo_urls TEXT[] DEFAULT '{}',
        generated_photo_urls TEXT[] DEFAULT '{}',
        style_variations TEXT[] DEFAULT '{}',
        bio_suggestions TEXT[] DEFAULT '{}',
        processing_started_at TIMESTAMP WITH TIME ZONE,
        processing_completed_at TIMESTAMP WITH TIME ZONE,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Create indexes for better performance
        const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_submission_id ON onboarding_submissions(submission_id);
      CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_email ON onboarding_submissions(email);
      CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_created_at ON onboarding_submissions(created_at);
      
      CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
      CREATE INDEX IF NOT EXISTS idx_payments_submission_id ON payments(submission_id);
      CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON payments(customer_email);
      CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      
      CREATE INDEX IF NOT EXISTS idx_photo_generations_submission_id ON photo_generations(submission_id);
      CREATE INDEX IF NOT EXISTS idx_photo_generations_payment_id ON photo_generations(payment_id);
      CREATE INDEX IF NOT EXISTS idx_photo_generations_status ON photo_generations(status);
    `;

        // Create triggers for updated_at timestamps
        const createTriggers = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_onboarding_submissions_updated_at ON onboarding_submissions;
      CREATE TRIGGER update_onboarding_submissions_updated_at
        BEFORE UPDATE ON onboarding_submissions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
      CREATE TRIGGER update_payments_updated_at
        BEFORE UPDATE ON payments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_photo_generations_updated_at ON photo_generations;
      CREATE TRIGGER update_photo_generations_updated_at
        BEFORE UPDATE ON photo_generations
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

        // Execute all queries
        await query(createOnboardingTable);
        console.log('✅ Created onboarding_submissions table');

        await query(createPaymentsTable);
        console.log('✅ Created payments table');

        await query(createUsersTable);
        console.log('✅ Created users table');

        await query(createPhotoGenerationsTable);
        console.log('✅ Created photo_generations table');

        await query(createIndexes);
        console.log('✅ Created database indexes');

        await query(createTriggers);
        console.log('✅ Created update triggers');

        console.log('🎉 Database setup completed successfully!');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    }
};

// Main setup function
const setupDatabase = async () => {
    try {
        // Test connection first
        const connected = await testConnection();
        if (!connected) {
            process.exit(1);
        }

        // Create tables
        await createTables();

        console.log('🚀 Database is ready to use!');
        process.exit(0);

    } catch (error) {
        console.error('💥 Setup failed:', error);
        process.exit(1);
    }
};

// Run setup if called directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase, createTables };
