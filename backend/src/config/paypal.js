const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

// PayPal configuration
const mode = process.env.PAYPAL_MODE || 'sandbox';
const clientId = (mode === 'production' || mode === 'live') ? process.env.LIVE_PAYPAL_CLIENT_ID : process.env.PAYPAL_CLIENT_ID;
const clientSecret = (mode === 'production' || mode === 'live') ? process.env.LIVE_PAYPAL_CLIENT_SECRET : process.env.PAYPAL_SECRET_KEY;

// Validate PayPal configuration
if (!clientId || !clientSecret) {
    console.warn('⚠️  PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_SECRET_KEY in environment variables.');
    console.warn('   Using fallback PayPal client ID for development');
}

// Log PayPal configuration (without secret)
console.log('🔧 PayPal Config:', {
    clientId: clientId ? `${clientId.substring(0, 10)}...` : 'not set',
    mode: mode,
    apiBase: process.env.PAYPAL_API_BASE || 'not set'
});

// Configure PayPal environment
let environment;
const apiBase = process.env.PAYPAL_API_BASE || ((mode === 'production' || mode === 'live') ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');

if (mode === 'production' || mode === 'live') {
    environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
} else {
    environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// Create PayPal client
const client = new paypal.core.PayPalHttpClient(environment);

// PayPal API functions
const paypalAPI = {
    // Create an order
    createOrder: async (orderData) => {
        try {
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody(orderData);

            const response = await client.execute(request);
            return {
                success: true,
                order: response.result,
                orderId: response.result.id
            };
        } catch (error) {
            console.error('PayPal create order error:', error);
            return {
                success: false,
                error: error.message || 'Failed to create PayPal order'
            };
        }
    },

    // Capture an order
    captureOrder: async (orderId) => {
        try {
            const request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.prefer("return=representation");
            request.requestBody({});

            const response = await client.execute(request);
            return {
                success: true,
                capture: response.result,
                paymentId: response.result.purchase_units[0].payments.captures[0].id
            };
        } catch (error) {
            console.error('PayPal capture order error:', error);
            return {
                success: false,
                error: error.message || 'Failed to capture PayPal order'
            };
        }
    },

    // Get order details
    getOrder: async (orderId) => {
        try {
            const request = new paypal.orders.OrdersGetRequest(orderId);
            const response = await client.execute(request);

            return {
                success: true,
                order: response.result
            };
        } catch (error) {
            console.error('PayPal get order error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get PayPal order'
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