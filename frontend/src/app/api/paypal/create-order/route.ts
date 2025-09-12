// lib/paypal.ts
// Single source of truth for env + base URL, with safe fallbacks.

const FALLBACK_BASE = "https://api-m.sandbox.paypal.com"; // default to sandbox

export const PAYPAL_API_BASE =
    process.env.PAYPAL_API_BASE?.trim() || FALLBACK_BASE;

// Prefer standard names, accept older aliases if they slip in.
const CLIENT_ID =
    process.env.PAYPAL_CLIENT_ID || process.env.SANDBOX_PAYPAL_CLIENT_ID;

const CLIENT_SECRET =
    process.env.PAYPAL_CLIENT_SECRET ||
    process.env.PAYPAL_SECRET_KEY ||           // if you briefly used this name
    process.env.SANDBOX_PAYPAL_SECRET_KEY;

function requireCreds() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error(
            "PayPal credentials missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET."
        );
    }
}

export async function getAccessToken(): Promise<string> {
    requireCreds();

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
