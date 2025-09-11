// PayPal Configuration for Backend
// Force sandbox environment for consistency with frontend

const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getAccessToken() {
    const clientId = process.env.SANDBOX_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.SANDBOX_PAYPAL_SECRET_KEY;

    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials not found in environment variables');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get PayPal access token: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
}

module.exports = {
    PAYPAL_API_BASE,
    getAccessToken
};
