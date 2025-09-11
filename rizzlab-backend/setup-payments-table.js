const pool = require('./src/config/database');

async function setupPaymentsTable() {
  try {
    console.log('Setting up payments table...');
    
    // Create payments table
    await pool.query(`
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

    console.log('✅ Payments table created successfully!');
    
    // Test the table
    const result = await pool.query('SELECT COUNT(*) FROM payments');
    console.log(`📊 Current payments count: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error setting up payments table:', error);
  } finally {
    await pool.end();
  }
}

setupPaymentsTable();
