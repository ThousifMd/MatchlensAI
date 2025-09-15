const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Optimized database schema with indexes and constraints
const optimizedSchema = `
-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS onboarding_submissions CASCADE;

-- Create optimized onboarding_submissions table
CREATE TABLE onboarding_submissions (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 100),
    dating_goal VARCHAR(20) NOT NULL CHECK (dating_goal IN ('serious', 'casual', 'friends', 'explore')),
    current_matches VARCHAR(10) NOT NULL CHECK (current_matches IN ('0-2', '3-5', '6-10', '10+')),
    body_type VARCHAR(20) NOT NULL CHECK (body_type IN ('slim', 'average', 'athletic', 'curvy', 'muscular')),
    style_preference VARCHAR(20) NOT NULL CHECK (style_preference IN ('casual', 'professional', 'trendy', 'classic', 'edgy')),
    ethnicity VARCHAR(20) NOT NULL CHECK (ethnicity IN ('white', 'black', 'hispanic', 'asian', 'middle-eastern', 'mixed', 'other')),
    interests JSONB NOT NULL DEFAULT '[]'::jsonb,
    current_bio TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    weekly_tips BOOLEAN NOT NULL DEFAULT false,
    original_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    screenshot_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create optimized payments table
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES onboarding_submissions(user_id) ON DELETE CASCADE,
    order_id VARCHAR(100) NOT NULL UNIQUE,
    paypal_payment_id VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD')),
    package_id VARCHAR(50) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
    paypal_data JSONB, -- Store full PayPal response for debugging
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create optimized indexes for better performance
CREATE INDEX idx_onboarding_submissions_email ON onboarding_submissions(email);
CREATE INDEX idx_onboarding_submissions_created_at ON onboarding_submissions(created_at DESC);
CREATE INDEX idx_onboarding_submissions_dating_goal ON onboarding_submissions(dating_goal);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_paypal_payment_id ON payments(paypal_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_customer_email ON payments(customer_email);

-- Create composite indexes for common queries
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_payments_created_status ON payments(created_at DESC, status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_onboarding_submissions_updated_at 
    BEFORE UPDATE ON onboarding_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for common queries (joins)
CREATE VIEW payment_details AS
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
    p.updated_at as payment_updated_at,
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
    o.created_at as onboarding_created_at,
    o.updated_at as onboarding_updated_at
FROM payments p
JOIN onboarding_submissions o ON p.user_id = o.user_id;

-- Create function to get payment statistics
CREATE OR REPLACE FUNCTION get_payment_stats()
RETURNS TABLE (
    total_payments BIGINT,
    total_revenue DECIMAL(12,2),
    completed_payments BIGINT,
    pending_payments BIGINT,
    failed_payments BIGINT,
    avg_order_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_payments,
        COALESCE(SUM(amount), 0) as total_revenue,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_payments,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_payments,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_payments,
        COALESCE(AVG(amount), 0) as avg_order_value
    FROM payments;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;
`;

// Function to setup the optimized database
async function setupOptimizedDatabase() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_HOST?.includes('digitalocean') ? { rejectUnauthorized: false } : false,
    });

    try {
        console.log('🚀 Setting up optimized database schema...');
        
        // Execute the schema
        await pool.query(optimizedSchema);
        
        console.log('✅ Optimized database schema created successfully!');
        console.log('📊 Created tables: onboarding_submissions, payments');
        console.log('🔍 Created indexes for optimal performance');
        console.log('📈 Created views and functions for analytics');
        
        // Test the setup
        const result = await pool.query('SELECT COUNT(*) FROM payment_details');
        console.log(`✅ Test query successful: ${result.rows[0].count} records in payment_details view`);
        
    } catch (error) {
        console.error('❌ Error setting up optimized database:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    setupOptimizedDatabase()
        .then(() => {
            console.log('🎉 Database setup completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database setup failed:', error);
            process.exit(1);
        });
}

module.exports = { setupOptimizedDatabase, optimizedSchema };
