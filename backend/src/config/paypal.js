const paypal = require('@paypal/checkout-server-sdk');

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Optimized PayPal configuration with better validation
const mode = process.env.PAYPAL_MODE || 'sandbox';
const isLive = mode === 'production' || mode === 'live';

const clientId = isLive ? process.env.LIVE_PAYPAL_CLIENT_ID : process.env.PAYPAL_CLIENT_ID;
const clientSecret = isLive ? process.env.LIVE_PAYPAL_CLIENT_SECRET : process.env.PAYPAL_SECRET_KEY;

// Enhanced PayPal configuration validation
const validatePayPalConfig = () => {
    const errors = [];
    
    if (!clientId) {
        errors.push('PAYPAL_CLIENT_ID not set');
    }
    if (!clientSecret) {
        errors.push('PAYPAL_SECRET_KEY not set');
    }
    if (!process.env.FRONTEND_URL) {
        errors.push('FRONTEND_URL not set (required for return/cancel URLs)');
    }
    
    if (errors.length > 0) {
        console.warn('⚠️  PayPal configuration issues:', errors.join(', '));
        return false;
    }
    
    return true;
};

const isValidConfig = validatePayPalConfig();

// Enhanced PayPal configuration logging
console.log('🔧 PayPal Config:', {
    mode: mode,
    isLive: isLive,
    clientId: clientId ? `${clientId.substring(0, 10)}...` : 'not set',
    apiBase: process.env.PAYPAL_API_BASE || (isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'),
    frontendUrl: process.env.FRONTEND_URL || 'not set',
    valid: isValidConfig
});

// Configure PayPal environment with error handling
let environment;
let client;

try {
    const apiBase = process.env.PAYPAL_API_BASE || (isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');
    
    if (isLive) {
        environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
    } else {
        environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    }
    
    // Create PayPal client with timeout configuration
    client = new paypal.core.PayPalHttpClient(environment);
    
    console.log('✅ PayPal client initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize PayPal client:', error.message);
    client = null;
}

// Optimized PayPal API functions with better error handling and logging
const paypalAPI = {
    // Create an order with enhanced error handling
    createOrder: async (orderData) => {
        if (!client) {
            return {
                success: false,
                error: 'PayPal client not initialized'
            };
        }
        
        try {
            const startTime = Date.now();
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody(orderData);

            const response = await client.execute(request);
            const processingTime = Date.now() - startTime;
            
            console.log(`✅ PayPal order created in ${processingTime}ms:`, response.result.id);
            
            return {
                success: true,
                order: response.result,
                orderId: response.result.id,
                processingTime: `${processingTime}ms`
            };
        } catch (error) {
            console.error('❌ PayPal create order error:', {
                message: error.message,
                details: error.details,
                debugId: error.debug_id,
                timestamp: new Date().toISOString()
            });
            
            return {
                success: false,
                error: error.message || 'Failed to create PayPal order',
                debugId: error.debug_id
            };
        }
    },

    // Capture an order with enhanced error handling
    captureOrder: async (orderId) => {
        if (!client) {
            return {
                success: false,
                error: 'PayPal client not initialized'
            };
        }
        
        try {
            const startTime = Date.now();
            const request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.prefer("return=representation");
            request.requestBody({});

            const response = await client.execute(request);
            const processingTime = Date.now() - startTime;
            
            const capture = response.result.purchase_units[0].payments.captures[0];
            console.log(`✅ PayPal order captured in ${processingTime}ms:`, capture.id);
            
            return {
                success: true,
                capture: response.result,
                paymentId: capture.id,
                status: capture.status,
                processingTime: `${processingTime}ms`
            };
        } catch (error) {
            console.error('❌ PayPal capture order error:', {
                orderId,
                message: error.message,
                details: error.details,
                debugId: error.debug_id,
                timestamp: new Date().toISOString()
            });
            
            return {
                success: false,
                error: error.message || 'Failed to capture PayPal order',
                debugId: error.debug_id
            };
        }
    },

    // Get order details with enhanced error handling
    getOrder: async (orderId) => {
        if (!client) {
            return {
                success: false,
                error: 'PayPal client not initialized'
            };
        }
        
        try {
            const startTime = Date.now();
            const request = new paypal.orders.OrdersGetRequest(orderId);
            const response = await client.execute(request);
            const processingTime = Date.now() - startTime;
            
            console.log(`✅ PayPal order retrieved in ${processingTime}ms:`, orderId);
            
            return {
                success: true,
                order: response.result,
                processingTime: `${processingTime}ms`
            };
        } catch (error) {
            console.error('❌ PayPal get order error:', {
                orderId,
                message: error.message,
                details: error.details,
                debugId: error.debug_id,
                timestamp: new Date().toISOString()
            });
            
            return {
                success: false,
                error: error.message || 'Failed to get PayPal order',
                debugId: error.debug_id
            };
        }
    }
};

// Helper function to create order data structure
const createOrderData = (amount, description, packageId, packageName, customId = null) => {
    return {
        intent: 'CAPTURE',
        purchase_units: [{
            reference_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            description: description,
            custom_id: customId || packageId || 'matchlens_package',
            amount: {
                currency_code: 'USD',
                value: amount.toString()
            },
            payee: {
                email_address: (mode === 'production' || mode === 'live')
                    ? (process.env.PAYPAL_MERCHANT_EMAIL || 'merchant@matchlens.ai')
                    : 'test-merchant@example.com' // Sandbox doesn't require real email
            }
        }],
        application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: `${process.env.FRONTEND_URL}/onboarding/success`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout`
        }
    };
};

module.exports = {
    client,
    paypalAPI,
    createOrderData,
    environment,
    PAYPAL_API_BASE: apiBase
};