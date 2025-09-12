// app/api/paypal/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";

export const runtime = "nodejs";

export async function GET() {
    return NextResponse.json(
        {
            message: "This endpoint only accepts POST requests",
            method: "GET not allowed",
            correctMethod: "POST",
        },
        { status: 405 }
    );
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount = "1.00", description = "Test Payment", packageId, packageName } = body;

        const accessToken = await getAccessToken();

        const orderData = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: `order_${Date.now()}`,
                    description,
                    custom_id: packageId || "package",
                    amount: { currency_code: "USD", value: String(amount) },
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"}/onboarding/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"}/checkout`,
            },
        };

        const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "PayPal-Request-Id": `create_order_${Date.now()}`,
            },
            body: JSON.stringify(orderData),
            cache: "no-store",
        });

        const order = await orderRes.json();

        if (!orderRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: `PayPal order creation failed`,
                    status: orderRes.status,
                    error: order,
                },
                { status: orderRes.status }
            );
        }

        return NextResponse.json({ success: true, order, orderId: order.id });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "PayPal order creation failed",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
