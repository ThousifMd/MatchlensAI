import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        NODE_ENV: process.env.NODE_ENV,
        PAYPAL_CLIENT_ID_EXISTS: !!process.env.PAYPAL_CLIENT_ID,
        PAYPAL_SECRET_KEY_EXISTS: !!process.env.PAYPAL_SECRET_KEY,
        PAYPAL_API_BASE_EXISTS: !!process.env.PAYPAL_API_BASE,
        NEXT_PUBLIC_PAYPAL_CLIENT_ID_EXISTS: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        PAYPAL_CLIENT_ID_LENGTH: process.env.PAYPAL_CLIENT_ID?.length || 0,
        PAYPAL_SECRET_KEY_LENGTH: process.env.PAYPAL_SECRET_KEY?.length || 0,
        NEXT_PUBLIC_PAYPAL_CLIENT_ID_LENGTH: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.length || 0,
        PAYPAL_CLIENT_ID_STARTS_WITH: process.env.PAYPAL_CLIENT_ID?.substring(0, 10) || 'NOT_FOUND',
        NEXT_PUBLIC_PAYPAL_CLIENT_ID_STARTS_WITH: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10) || 'NOT_FOUND',
        PAYPAL_API_BASE: process.env.PAYPAL_API_BASE || 'NOT_SET',
    });
}
