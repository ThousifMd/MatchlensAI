import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        console.log('🧪 Testing PayPal payment creation...');

        const accessToken = await getAccessToken();

        // Create a simple test order
        const orderData = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: "TEST_ORDER_" + Date.now(),
                    description: "Test Payment",
                    amount: { currency_code: "USD", value: "69.00" }, // Professional package price
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
            },
        };

        console.log('Creating test order:', JSON.stringify(orderData, null, 2));

        const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "PayPal-Request-Id": `test_${Date.now()}`,
            },
            body: JSON.stringify(orderData),
        });

        const order = await orderRes.json();

        if (!orderRes.ok) {
            console.error('Test order creation failed:', order);
            return NextResponse.json({
                success: false,
                error: order,
                message: "Failed to create test order"
            }, { status: orderRes.status });
        }

        console.log('Test order created successfully:', order.id);

        return NextResponse.json({
            success: true,
            order: order,
            message: "Test order created successfully",
            orderId: order.id
        });

    } catch (error) {
        console.error('Test payment error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Test payment failed"
        }, { status: 500 });
    }
}
