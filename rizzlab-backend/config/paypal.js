const paypal = require('@paypal/paypal-server-sdk');

// PayPal configuration
const client = new paypal.Client({
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    clientId: process.env.SANDBOX_PAYPAL_CLIENT_ID,
    clientSecret: process.env.SANDBOX_PAYPAL_SECRET_KEY
});

module.exports = {
    client
};
