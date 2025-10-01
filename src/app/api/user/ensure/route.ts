import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';
// import { UserStatus } from '@prisma/client'; // Using string literals instead
// import { AccessService } from '@/lib/planLimits'; // Comentado temporalmente para evitar errores

export async function POST() {
  try {
    console.log('POST /api/user/ensure - Starting request');
    
    const session = await getServerSession(authOptionsSafe);
    
    console.log('Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userName: session?.user?.name
    });
    
    if (!session?.user?.email) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: 'No authenticated user found' }, { status: 401 });
    }

    // Check if user exists
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      console.log('User lookup result:', {
        found: !!user,
        email: session.user.email,
        userId: user?.id
      });
    } catch (lookupError) {
      console.error('Error looking up user:', lookupError);
      return NextResponse.json({ 
        error: 'Failed to lookup user',
        details: lookupError instanceof Error ? lookupError.message : 'Unknown lookup error'
      }, { status: 500 });
    }

    if (!user) {
      console.log('Creating new user for:', session.user.email);
      
      try {
        // Crear usuario con trial automático de 7 días
        const now = new Date();
        const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || '',
            image: session.user.image || '',
            status: 'TRIAL',
            trialStartDate: now,
            trialEndDate: trialEndDate,
            isFirstYear: true,
          },
        });
        
        console.log('User created successfully with trial:', {
          id: user.id,
          email: user.email,
          status: user.status,
          trialEndDate: user.trialEndDate
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'User created successfully',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            status: user.status,
            trialEndDate: user.trialEndDate
          }
        });
      } catch (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ 
          error: 'Failed to create user',
          details: createError instanceof Error ? createError.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      console.log('User already exists:', user.id);
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          status: user.status,
          trialEndDate: user.trialEndDate,
          subscriptionEndDate: user.subscriptionEndDate
        }
      });
    }
  } catch (error) {
    console.error('Error in /api/user/ensure:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
    }, { status: 500 });
  }
}

// Also allow GET for testing
export async function GET() {
  return POST();
}