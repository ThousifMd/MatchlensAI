// PayPal API configuration
const FALLBACK_BASE = "https://api-m.sandbox.paypal.com";

export const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE?.trim() || FALLBACK_BASE;

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_SECRET_KEY;

function ensureCreds() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error("Set PAYPAL_CLIENT_ID and PAYPAL_SECRET_KEY in your env");
    }
}

export async function getAccessToken(): Promise<string> {
    ensureCreds();

    const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${creds}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`OAuth failed ${res.status} ${res.statusText} ${body.slice(0, 300)}`);
    }

    const json = await res.json();
    if (!json?.access_token) throw new Error("OAuth response missing access_token");
    return json.access_token as string;
}