const { Pool } = require('pg');

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env.local' });
}

// Optimized database configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('digitalocean') ? { rejectUnauthorized: false } : false,
    max: 15, // Increased for better concurrency
    min: 2,  // Keep minimum connections alive
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    acquireTimeoutMillis: 10000,
    statement_timeout: 30000,
    query_timeout: 30000,
    application_name: 'matchlens-backend',
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
});

// Enhanced pool event handling
pool.on('connect', (client) => {
    console.log('✅ New database client connected');
});

pool.on('error', (err, client) => {
    console.error('❌ Database pool error:', {
        message: err.message,
        code: err.code,
        detail: err.detail,
        timestamp: new Date().toISOString()
    });
});

pool.on('remove', (client) => {
    console.log('🔌 Database client removed from pool');
});

// Test database connection on startup
async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as db_version');
        console.log('✅ Database connection test successful:', {
            time: result.rows[0].current_time,
            version: result.rows[0].db_version.split(' ')[0]
        });
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
        return false;
    }
}

// Graceful shutdown function
async function closePool() {
    try {
        await pool.end();
        console.log('✅ Database pool closed gracefully');
    } catch (error) {
        console.error('❌ Error closing database pool:', error.message);
    }
}

module.exports = { 
    pool, 
    testConnection, 
    closePool 
};