import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('DEBUG SESSION: Starting session analysis...');
    
    const session = await getServerSession(authOptionsSafe);
    
    console.log('DEBUG SESSION: Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userName: session?.user?.name
    });

    if (!session?.user) {
      return NextResponse.json({
        error: 'No session found',
        solution: 'Please login first'
      });
    }

    // Check if user exists by the session ID
    let userById = null;
    if (session.user.id) {
      userById = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
    }

    // Check if user exists by email
    let userByEmail = null;
    if (session.user.email) {
      userByEmail = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
    }

    // Get all users for comparison
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true
      }
    });

    const diagnosis = {
      session: {
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name
      },
      database: {
        userFoundById: !!userById,
        userFoundByEmail: !!userByEmail,
        userByIdDetails: userById ? {
          id: userById.id,
          email: userById.email,
          name: userById.name,
          plan: userById.plan
        } : null,
        userByEmailDetails: userByEmail ? {
          id: userByEmail.id,
          email: userByEmail.email,
          name: userByEmail.name,
          plan: userByEmail.plan
        } : null,
        totalUsers: allUsers.length,
        allUsers: allUsers
      },
      problem: {
        identified: false,
        description: '',
        solution: ''
      }
    };

    // Identify the problem
    if (!userById && !userByEmail) {
      diagnosis.problem = {
        identified: true,
        description: 'User does not exist in database at all',
        solution: 'Need to create user with email: ' + session.user.email
      };
    } else if (!userById && userByEmail) {
      diagnosis.problem = {
        identified: true,
        description: 'Session userId does not match database ID',
        solution: `Session ID: ${session.user.id} but database ID: ${userByEmail.id}`
      };
    } else if (userById && !userByEmail) {
      diagnosis.problem = {
        identified: true,
        description: 'User found by ID but email mismatch',
        solution: 'Check email consistency'
      };
    } else {
      diagnosis.problem = {
        identified: false,
        description: 'User exists correctly',
        solution: 'Problem might be elsewhere'
      };
    }

    return NextResponse.json(diagnosis);

  } catch (error) {
    console.error('DEBUG SESSION ERROR:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}