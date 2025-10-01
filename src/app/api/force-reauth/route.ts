import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';

export async function POST() {
  try {
    console.log('Force reauth - checking current session');
    const session = await getServerSession(authOptionsSafe);
    
    if (session?.user?.email) {
      // Clear any existing JWT tokens by returning a response that clears cookies
      const response = NextResponse.json({ 
        message: 'Please sign out and sign in again to refresh your session',
        email: session.user.email 
      });
      
      // Clear NextAuth cookies
      response.cookies.set('next-auth.session-token', '', { 
        expires: new Date(0),
        path: '/'
      });
      response.cookies.set('__Secure-next-auth.session-token', '', { 
        expires: new Date(0),
        path: '/'
      });
      
      return response;
    }
    
    return NextResponse.json({ message: 'No active session found' });
  } catch (error) {
    console.error('Force reauth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}