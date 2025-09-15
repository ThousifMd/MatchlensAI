const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Simple database configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('digitalocean') ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

module.exports = { pool };