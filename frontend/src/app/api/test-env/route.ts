import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        NODE_ENV: process.env.NODE_ENV,
        SANDBOX_PAYPAL_CLIENT_ID_EXISTS: !!process.env.SANDBOX_PAYPAL_CLIENT_ID,
        SANDBOX_PAYPAL_SECRET_KEY_EXISTS: !!process.env.SANDBOX_PAYPAL_SECRET_KEY,
        NEXT_PUBLIC_PAYPAL_CLIENT_ID_EXISTS: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        SANDBOX_PAYPAL_CLIENT_ID_LENGTH: process.env.SANDBOX_PAYPAL_CLIENT_ID?.length || 0,
        SANDBOX_PAYPAL_SECRET_KEY_LENGTH: process.env.SANDBOX_PAYPAL_SECRET_KEY?.length || 0,
        NEXT_PUBLIC_PAYPAL_CLIENT_ID_LENGTH: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.length || 0,
        SANDBOX_PAYPAL_CLIENT_ID_STARTS_WITH: process.env.SANDBOX_PAYPAL_CLIENT_ID?.substring(0, 10) || 'NOT_FOUND',
        NEXT_PUBLIC_PAYPAL_CLIENT_ID_STARTS_WITH: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10) || 'NOT_FOUND',
    });
}
