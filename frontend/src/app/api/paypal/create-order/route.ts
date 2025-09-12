import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    return NextResponse.json({
        message: "This endpoint only accepts POST requests",
        method: "GET not allowed",
        correctMethod: "POST"
    }, { status: 405 });
}

export async function POST(req: NextRequest) {
    try {
        console.log('🔍 PayPal API Route - Request received');

        let requestBody;
        try {
            requestBody = await req.json();
            console.log('📦 Request body:', requestBody);
        } catch (jsonError) {
            console.error('❌ Failed to parse request body:', jsonError);
            return NextResponse.json({
                success: false,
                error: "Invalid JSON in request body",
                message: "Request body must be valid JSON"
            }, { status: 400 });
        }

        const { amount = "1.00", description = "Test Payment", packageId, packageName } = requestBody;

        console.log('🔍 Creating PayPal order:', { amount, description, packageId, packageName });

        // Debug environment variables
        console.log('🔧 Environment check:');
        console.log('  NODE_ENV:', process.env.NODE_ENV);
        console.log('  Using SANDBOX credentials for testing');
        console.log('  SANDBOX_PAYPAL_CLIENT_ID exists:', !!process.env.SANDBOX_PAYPAL_CLIENT_ID);
        console.log('  SANDBOX_PAYPAL_SECRET_KEY exists:', !!process.env.SANDBOX_PAYPAL_SECRET_KEY);
        console.log('  NEXT_PUBLIC_PAYPAL_CLIENT_ID exists:', !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
        console.log('  All env vars with SANDBOX:', Object.keys(process.env).filter(key => key.includes('SANDBOX')));
        console.log('  All env vars with PAYPAL:', Object.keys(process.env).filter(key => key.includes('PAYPAL')));

        // Check if we're using test credentials (only for development)
        // This allows developers to set SANDBOX_PAYPAL_CLIENT_ID=test for mock responses
        if (process.env.NODE_ENV === 'development' && process.env.SANDBOX_PAYPAL_CLIENT_ID === 'test') {
            console.log('🧪 Using test mode - returning mock order (SANDBOX_PAYPAL_CLIENT_ID=test)');

            // Return a mock order for testing
            const mockOrder = {
                id: `test_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'CREATED',
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        description: description,
                        custom_id: packageId || "test_package",
                        amount: {
                            currency_code: "USD",
                            value: amount.toString(),
                        },
                    },
                ],
            };

            return NextResponse.json({
                success: true,
                order: mockOrder,
                orderId: mockOrder.id
            });
        }

        console.log('🚀 Attempting to get PayPal access token...');
        let accessToken;
        try {
            accessToken = await getAccessToken();
            console.log('🔑 Access token received:', accessToken ? 'Yes' : 'No');
            console.log('🔑 Access token length:', accessToken?.length);
        } catch (tokenError) {
            console.error('❌ Failed to get PayPal access token:', tokenError);
            return NextResponse.json({
                success: false,
                error: tokenError instanceof Error ? tokenError.message : 'Failed to get access token',
                message: "PayPal authentication failed"
            }, { status: 500 });
        }

        // Create order data
        const orderData = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    description: description,
                    custom_id: packageId || "test_package",
                    amount: {
                        currency_code: "USD",
                        value: amount.toString(),
                    },
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/onboarding/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/checkout`,
            },
        };

        console.log('📡 Creating order with data:', JSON.stringify(orderData, null, 2));

        console.log('📡 Making request to PayPal API...');
        console.log('  URL:', `${PAYPAL_API_BASE}/v2/checkout/orders`);
        console.log('  Headers:', {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken?.substring(0, 20)}...`,
            "PayPal-Request-Id": `create_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });

        const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "PayPal-Request-Id": `create_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            },
            body: JSON.stringify(orderData),
        });

        console.log('📊 PayPal API Response:');
        console.log('  Status:', orderRes.status);
        console.log('  Status Text:', orderRes.statusText);
        console.log('  Headers:', Object.fromEntries(orderRes.headers.entries()));

        const order = await orderRes.json();
        console.log('📄 PayPal API Response Body:', order);

        if (!orderRes.ok) {
            console.error('❌ PayPal order creation failed:', order);
            return NextResponse.json({
                success: false,
                error: order,
                message: `PayPal order creation failed: ${orderRes.status} ${orderRes.statusText}`,
                paypalError: order
            }, { status: orderRes.status });
        }

        console.log('✅ PayPal order created successfully:', order.id);

        return NextResponse.json({
            success: true,
            order: order,
            orderId: order.id
        });

    } catch (error) {
        console.error('❌ PayPal order creation error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "PayPal order creation failed"
        }, { status: 500 });
    }
}