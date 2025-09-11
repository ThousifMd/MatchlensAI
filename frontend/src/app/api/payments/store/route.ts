import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const paymentData = await req.json();

    console.log('🔄 Proxying payment data to backend:', paymentData);

    const apiBase = process.env.BACKEND_BASE_URL || 'http://localhost:5001';

    // Validate backend URL
    console.log('🔧 Backend Configuration:');
    console.log('  NODE_ENV:', process.env.NODE_ENV);
    console.log('  BACKEND_BASE_URL:', apiBase);
    console.log('  Using default URL:', !process.env.BACKEND_BASE_URL);

    if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_BASE_URL) {
      console.error('❌ BACKEND_BASE_URL not set in production!');
      return NextResponse.json({
        ok: false,
        error: 'Backend configuration error'
      }, { status: 500 });
    }

    const upstream = await fetch(`${apiBase}/api/payments/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    const text = await upstream.text();
    console.log('📊 Backend response status:', upstream.status);
    console.log('📄 Backend response:', text);

    // Bubble up the actual status and JSON if possible
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, raw: text };
    }

    if (upstream.ok) {
      console.log('✅ Payment stored successfully via proxy');
      return NextResponse.json(data);
    } else {
      console.error('❌ Backend error:', data);
      return NextResponse.json(data, { status: upstream.status });
    }

  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return NextResponse.json({
      ok: false,
      error: err?.message || 'Upstream error'
    }, { status: 502 });
  }
}
