import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory storage for demo purposes (in production, use a database)
const paymentRecords: any[] = [];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { paymentId, packageId, amount } = body;

        // For now, we'll simulate payment verification
        // In production, you would check against your database or PayPal API

        console.log('🔍 Verifying payment:', { paymentId, packageId, amount });

        // Simulate payment verification
        const paymentStatus = {
            paymentId,
            packageId,
            amount,
            status: "COMPLETED",
            timestamp: new Date().toISOString(),
            verified: true
        };

        return NextResponse.json({
            success: true,
            payment: paymentStatus
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({
            success: false,
            error: "Payment verification failed"
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.json({
                success: false,
                error: "Payment ID is required"
            }, { status: 400 });
        }

        // Simulate payment lookup
        const paymentStatus = {
            paymentId,
            status: "COMPLETED",
            timestamp: new Date().toISOString(),
            verified: true
        };

        return NextResponse.json({
            success: true,
            payment: paymentStatus
        });

    } catch (error) {
        console.error('Payment lookup error:', error);
        return NextResponse.json({
            success: false,
            error: "Payment lookup failed"
        }, { status: 500 });
    }
}
