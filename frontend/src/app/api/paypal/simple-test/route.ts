import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    try {
        console.log('🧪 Creating simple PayPal test order...');

        const accessToken = await getAccessToken();

        // Create a very simple test order
        const orderData = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: "SIMPLE_TEST_" + Date.now(),
                    description: "Simple Test Payment",
                    amount: {
                        currency_code: "USD",
                        value: "69.00" // Professional package price
                    },
                },
            ],
        };

        console.log('Creating simple test order...');

        const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "PayPal-Request-Id": `simple_test_${Date.now()}`,
            },
            body: JSON.stringify(orderData),
        });

        const order = await orderRes.json();

        if (!orderRes.ok) {
            console.error('Simple test order failed:', order);
            return NextResponse.json({
                success: false,
                error: order,
                message: "Simple test order failed"
            }, { status: orderRes.status });
        }

        console.log('Simple test order created:', order.id);

        return NextResponse.json({
            success: true,
            order: order,
            message: "Simple test order created successfully",
            orderId: order.id,
            approveUrl: order.links?.find((link: any) => link.rel === 'approve')?.href
        });

    } catch (error) {
        console.error('Simple test error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Simple test failed"
        }, { status: 500 });
    }
}
