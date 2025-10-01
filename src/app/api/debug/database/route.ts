import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('DEBUG: Testing database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('DEBUG: Database connection successful:', result);
    
    // Check if User table exists
    try {
      const userCount = await prisma.user.count();
      console.log('DEBUG: User table exists, count:', userCount);
      
      // List first 3 users (without sensitive data)
      const users = await prisma.user.findMany({
        take: 3,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          createdAt: true
        }
      });
      console.log('DEBUG: Sample users:', users);
      
      return NextResponse.json({
        success: true,
        database: {
          connected: true,
          userTableExists: true,
          userCount,
          sampleUsers: users
        }
      });
    } catch (userError) {
      console.error('DEBUG: User table error:', userError);
      return NextResponse.json({
        success: false,
        database: {
          connected: true,
          userTableExists: false,
          error: userError instanceof Error ? userError.message : 'Unknown user table error'
        }
      });
    }
  } catch (dbError) {
    console.error('DEBUG: Database connection failed:', dbError);
    return NextResponse.json({
      success: false,
      database: {
        connected: false,
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }
    });
  }
}