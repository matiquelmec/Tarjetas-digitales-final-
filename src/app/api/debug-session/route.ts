import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG SESSION ENDPOINT ===');
    
    // Log request headers
    console.log('Request headers:', {
      cookie: request.headers.get('cookie'),
      authorization: request.headers.get('authorization'),
      'user-agent': request.headers.get('user-agent'),
    });

    const session = await getServerSession(authOptionsSafe);
    console.log('getServerSession result:', session);

    const debugInfo = {
      timestamp: new Date().toISOString(),
      hasSession: !!session,
      sessionData: session ? {
        user: session.user,
        expires: session.expires,
      } : null,
      headers: {
        hasCookie: !!request.headers.get('cookie'),
        cookieLength: request.headers.get('cookie')?.length || 0,
        cookiePreview: request.headers.get('cookie')?.substring(0, 100) + '...',
      },
      authConfig: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      }
    };

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}