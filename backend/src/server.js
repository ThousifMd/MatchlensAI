console.log('🔄 Starting server initialization...');

const express = require('express');
console.log('✅ Express loaded');

const cors = require('cors');
console.log('✅ CORS loaded');

const helmet = require('helmet');
console.log('✅ Helmet loaded');

const compression = require('compression');
console.log('✅ Compression loaded');

const rateLimit = require('express-rate-limit');
console.log('✅ Rate limit loaded');

require('dotenv').config();
console.log('✅ Environment variables loaded');

// const { testConnection } = require('./config/database');

// Import routes
console.log('🔄 Loading payment routes...');
const paymentRoutes = require('./routes/payments');
console.log('✅ Payment routes loaded');

console.log('🔄 Creating Express app...');
const app = express();
console.log('✅ Express app created');

const PORT = process.env.PORT || 5001;
console.log('✅ Port configured:', PORT);

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
    console.log('🏥 Health check requested at:', new Date().toISOString());
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Railway might also check root endpoint
app.get('/', (req, res) => {
    console.log('🏠 Root endpoint requested at:', new Date().toISOString());
    res.status(200).json({
        message: 'API is running',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
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
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`🔗 Database ping: http://0.0.0.0:${PORT}/api/ping-db`);
    console.log(`🔗 Database test: http://0.0.0.0:${PORT}/api/test-db`);

    // Add a small delay to ensure server is fully ready
    setTimeout(() => {
        console.log('✅ Server fully ready and accepting connections');
    }, 1000);
});
