import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    const callbackInfo = {
      baseUrl,
      expectedGoogleCallback: `${baseUrl}/api/auth/callback/google`,
      nextauthUrl: process.env.NEXTAUTH_URL,
      currentHost: url.host,
      protocol: url.protocol,
      timestamp: new Date().toISOString()
    };

    console.log('Callback info:', callbackInfo);

    return NextResponse.json({
      success: true,
      callback: callbackInfo,
      message: 'Add this URL to your Google Cloud Console Authorized redirect URIs',
      instructions: [
        '1. Go to Google Cloud Console',
        '2. Navigate to APIs & Services > Credentials',  
        '3. Edit your OAuth 2.0 Client',
        '4. Add this to Authorized redirect URIs:',
        callbackInfo.expectedGoogleCallback
      ]
    });
  } catch (error) {
    console.error('Callback info error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}