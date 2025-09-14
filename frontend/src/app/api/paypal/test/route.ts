import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Testing PayPal API connectivity...');

    // Test 1: Check environment variables
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET_KEY;

    console.log('🔑 Environment Variables:');
    console.log('- PAYPAL_CLIENT_ID:', clientId ? 'Present' : 'Missing');
    console.log('- PAYPAL_SECRET_KEY:', clientSecret ? 'Present' : 'Missing');
    console.log('- PAYPAL_API_BASE:', PAYPAL_API_BASE);

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: "Missing PayPal credentials in environment variables"
      }, { status: 400 });
    }

    // Test 2: Get access token
    console.log('🔑 Getting access token...');
    const accessToken = await getAccessToken();
    console.log('🔑 Access token received:', accessToken ? 'Yes' : 'No');

    // Test 3: Make a simple API call
    console.log('🔍 Testing API call...');
    const testResponse = await fetch(`${PAYPAL_API_BASE}/v1/identity/oauth2/userinfo`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    console.log('📡 Test API Response Status:', testResponse.status);

    if (testResponse.ok) {
      const userInfo = await testResponse.json();
      console.log('✅ PayPal API test successful');

      return NextResponse.json({
        success: true,
        message: "PayPal API is working correctly",
        userInfo: userInfo,
        apiBase: PAYPAL_API_BASE,
        hasCredentials: true
      });
    } else {
      const errorText = await testResponse.text();
      console.error('❌ PayPal API test failed:', errorText);

      return NextResponse.json({
        success: false,
        error: "PayPal API test failed",
        status: testResponse.status,
        details: errorText
      }, { status: testResponse.status });
    }

  } catch (error) {
    console.error('❌ PayPal test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
