const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Optimized rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message || 'Too many requests, please try again later'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            console.warn(`⚠️ Rate limit exceeded for ${req.ip} on ${req.path}`);
            res.status(429).json({
                success: false,
                message: message || 'Too many requests, please try again later',
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

// Different rate limits for different endpoints
const rateLimits = {
    // General API rate limit
    general: createRateLimit(15 * 60 * 1000, 100, 'Too many API requests'), // 100 requests per 15 minutes
    
    // Payment endpoints - more restrictive
    payments: createRateLimit(15 * 60 * 1000, 10, 'Too many payment requests'), // 10 requests per 15 minutes
    
    // Health check - very permissive
    health: createRateLimit(60 * 1000, 60, 'Too many health check requests'), // 60 requests per minute
};

// Request logging middleware
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const originalSend = res.send;
    
    res.send = function(data) {
        const processingTime = Date.now() - startTime;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${processingTime}ms - ${req.ip}`);
        originalSend.call(this, data);
    };
    
    next();
};

// Enhanced error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
};

// Validation middleware for onboarding data
const validateOnboardingData = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('age').optional().isInt({ min: 18, max: 100 }).withMessage('Age must be 18-100'),
    body('datingGoal').isIn(['serious', 'casual', 'friends', 'explore']).withMessage('Invalid dating goal'),
    body('currentMatches').isIn(['0-2', '3-5', '6-10', '10+']).withMessage('Invalid current matches selection'),
    body('bodyType').isIn(['slim', 'average', 'athletic', 'curvy', 'muscular']).withMessage('Invalid body type'),
    body('stylePreference').isIn(['casual', 'professional', 'trendy', 'classic', 'edgy']).withMessage('Invalid style preference'),
    body('ethnicity').isIn(['white', 'black', 'hispanic', 'asian', 'middle-eastern', 'mixed', 'other']).withMessage('Invalid ethnicity'),
    body('interests').isArray({ min: 1, max: 10 }).withMessage('Must select 1-10 interests'),
    body('currentBio').optional().isLength({ max: 500 }).withMessage('Bio must be under 500 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('weeklyTips').isBoolean().withMessage('Weekly tips must be boolean'),
    
    // Validation result handler
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

// Validation middleware for payment data
const validatePaymentData = [
    body('orderId').trim().isLength({ min: 3, max: 100 }).withMessage('Order ID required'),
    body('paymentId').trim().isLength({ min: 3, max: 100 }).withMessage('Payment ID required'),
    body('amount').isFloat({ min: 0.01, max: 10000 }).withMessage('Amount must be between $0.01 and $10,000'),
    body('currency').isIn(['USD', 'EUR', 'GBP', 'CAD']).withMessage('Invalid currency'),
    body('packageId').trim().isLength({ min: 1, max: 50 }).withMessage('Package ID required'),
    body('packageName').trim().isLength({ min: 1, max: 100 }).withMessage('Package name required'),
    body('customerEmail').isEmail().normalizeEmail().withMessage('Valid customer email required'),
    body('customerName').trim().isLength({ min: 2, max: 100 }).withMessage('Customer name required'),
    body('status').equals('completed').withMessage('Payment status must be completed'),
    body('onboardingData').isObject().withMessage('Onboarding data required'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Payment validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
};

// Request size limiter
const requestSizeLimiter = (maxSize = '10mb') => {
    return (req, res, next) => {
        const contentLength = parseInt(req.get('content-length') || '0');
        const maxBytes = parseInt(maxSize) * 1024 * 1024; // Convert MB to bytes
        
        if (contentLength > maxBytes) {
            return res.status(413).json({
                success: false,
                message: `Request too large. Maximum size: ${maxSize}`
            });
        }
        
        next();
    };
};

module.exports = {
    rateLimits,
    requestLogger,
    errorHandler,
    validateOnboardingData,
    validatePaymentData,
    securityHeaders,
    requestSizeLimiter
};
