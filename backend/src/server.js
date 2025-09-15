const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// const { testConnection } = require('./config/database');

// Import routes
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// Trust proxy for Railway (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// CORS configuration - Allow all origins globally
const corsOptions = {
    origin: true, // Allow all origins
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/payments', paymentRoutes);

// Health check endpoint - ultra simple
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Database ping endpoint
app.get('/api/ping-db', async (req, res) => {
    try {
        console.log('🔍 Testing database connection...');
        const isConnected = await testConnection();

        if (isConnected) {
            res.json({
                success: true,
                message: 'Database connection successful',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Database connection failed',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('❌ Database ping error:', error);
        res.status(500).json({
            success: false,
            message: 'Database ping failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Test data storage and retrieval endpoint
app.post('/api/test-db', async (req, res) => {
    try {
        const { query } = require('./config/database');

        console.log('🧪 Testing database data storage and retrieval...');

        // Create a test table if it doesn't exist
        await query(`
            CREATE TABLE IF NOT EXISTS test_table (
                id SERIAL PRIMARY KEY,
                test_data TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert test data
        const testData = `Test data - ${new Date().toISOString()}`;
        const insertResult = await query(
            'INSERT INTO test_table (test_data) VALUES ($1) RETURNING *',
            [testData]
        );

        console.log('✅ Test data inserted:', insertResult.rows[0]);

        // Retrieve test data
        const selectResult = await query(
            'SELECT * FROM test_table ORDER BY created_at DESC LIMIT 5'
        );

        console.log('✅ Test data retrieved:', selectResult.rows.length, 'records');

        res.json({
            success: true,
            message: 'Database test successful',
            insertedData: insertResult.rows[0],
            retrievedData: selectResult.rows,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Database test error:', error);
        res.status(500).json({
            success: false,
            message: 'Database test failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl
    });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Database ping: http://localhost:${PORT}/api/ping-db`);
    console.log(`🔗 Database test: http://localhost:${PORT}/api/test-db`);
});
