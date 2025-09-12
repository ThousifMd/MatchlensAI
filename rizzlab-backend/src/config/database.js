const { Pool } = require('pg');

// PayPal Configuration - Force sandbox for consistency
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined
  }
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to Digital Ocean PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

module.exports = pool;
