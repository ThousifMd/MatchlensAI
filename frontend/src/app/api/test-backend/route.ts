import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
    
    return NextResponse.json({
      success: true,
      backendUrl: backendUrl,
      hasBackendUrl: !!process.env.BACKEND_BASE_URL,
      message: 'Backend connection test'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
