import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔍 Capturing PayPal order:', id);

        // Check if we're using test credentials (only for development)
        if (process.env.NODE_ENV === 'development' && process.env.PAYPAL_CLIENT_ID === 'test') {
            console.log('🧪 Using test mode - returning mock capture');

            // Return a mock capture for testing
            const mockCapture = {
                id: `test_capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'COMPLETED',
                amount: {
                    currency_code: 'USD',
                    value: '1.00'
                },
                create_time: new Date().toISOString(),
                update_time: new Date().toISOString(),
                final_capture: true
            };

            return NextResponse.json({
                success: true,
                capture: mockCapture
            });
        }

        const accessToken = await getAccessToken();
        console.log('🔑 Access token received for capture');

        const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${id}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "PayPal-Request-Id": `capture_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            },
        });

        const capture = await captureRes.json();

        if (!captureRes.ok) {
            console.error('❌ PayPal capture failed:', capture);
            return NextResponse.json({
                success: false,
                error: capture,
                message: "Failed to capture PayPal order"
            }, { status: captureRes.status });
        }

        console.log('✅ PayPal order captured successfully:', capture.id);

        // Store payment data after successful capture
        try {
            const paymentData = {
                orderId: id,
                paymentId: capture.id, // Backend expects 'paymentId', not 'captureId'
                status: capture.status,
                amount: capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0.00',
                currency: capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code || 'USD',
                packageId: capture.purchase_units?.[0]?.custom_id || 'test_package',
                packageName: capture.purchase_units?.[0]?.description || 'Test Package',
                customerEmail: capture.payer?.email_address || null,
                customerName: `${capture.payer?.name?.given_name || ''} ${capture.payer?.name?.surname || ''}`.trim() || null,
                captureTime: new Date().toISOString(),
                paypalData: capture
            };

            console.log('💾 Storing payment data:', paymentData);
            //hardcoded backend url
            // Store payment data via the payments API
            const storeResponse = await fetch(`https://efficient-cooperation-production-a90a.up.railway.app/api/payments/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (storeResponse.ok) {
                console.log('✅ Payment data stored successfully');
            } else {
                console.error('❌ Failed to store payment data:', await storeResponse.text());
            }
        } catch (storeError) {
            console.error('❌ Error storing payment data:', storeError);
            // Don't fail the capture if storage fails
        }

        return NextResponse.json({
            success: true,
            capture: capture
        });

    } catch (error) {
        console.error('❌ PayPal capture error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "PayPal capture failed"
        }, { status: 500 });
    }
}
