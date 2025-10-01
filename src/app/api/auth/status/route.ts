import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple environment check without importing complex auth
    const envStatus = {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    console.log('Environment status check:', envStatus);

    return NextResponse.json({
      success: true,
      environment: envStatus,
      message: 'Basic environment check completed'
    });
  } catch (error) {
    console.error('Environment status error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}