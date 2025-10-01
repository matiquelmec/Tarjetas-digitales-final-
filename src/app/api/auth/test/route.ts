import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';
import { logger, LogEntry } from '@/lib/logger';

interface CheckStatus {
  connected?: boolean;
  canQuery?: boolean;
  configured?: boolean;
  hasSession?: boolean;
  sessionStrategy?: string;
  error?: string;
  GOOGLE_CLIENT_ID?: boolean;
  GOOGLE_CLIENT_SECRET?: boolean;
  NEXTAUTH_SECRET?: boolean;
  NEXTAUTH_URL?: string | undefined;
  DATABASE_URL?: boolean;
  NODE_ENV?: string | undefined;
}

interface Diagnostics {
  timestamp: string;
  checks: { [key: string]: CheckStatus };
  errors: string[];
  warnings: string[];
  session?: Session | null;
  recentLogs?: LogEntry[];
  recentErrors?: LogEntry[];
  healthy?: boolean;
}

export async function GET() {
  const diagnostics: Diagnostics = {
    timestamp: new Date().toISOString(),
    checks: {},
    errors: [],
    warnings: []
  };

  try {
    // Check environment variables
    diagnostics.checks.envVars = {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV
    };

    // Test database connection
    try {
      await prisma.$connect();
      await prisma.user.findFirst();
      diagnostics.checks.database = { connected: true, canQuery: true };
    } catch (dbError) {
      diagnostics.checks.database = { 
        connected: false, 
        error: dbError instanceof Error ? dbError.message : 'Unknown DB error' 
      };
      diagnostics.errors.push('Database connection failed');
    }

    // Test NextAuth session
    try {
      const session = await getServerSession(authOptionsSafe);
      diagnostics.checks.nextAuth = { 
        configured: true, 
        hasSession: !!session,
        sessionStrategy: 'database'
      };
      diagnostics.session = session;
    } catch (authError) {
      diagnostics.checks.nextAuth = { 
        configured: false, 
        error: authError instanceof Error ? authError.message : 'Unknown auth error' 
      };
      diagnostics.errors.push('NextAuth configuration failed');
    }

    // Get recent logs
    diagnostics.recentLogs = logger.getLogs().slice(-20);
    diagnostics.recentErrors = logger.getRecentErrors();

    // Overall health check
    diagnostics.healthy = diagnostics.errors.length === 0;

    return NextResponse.json(diagnostics, { 
      status: diagnostics.healthy ? 200 : 500 
    });

  } catch (error) {
    logger.error('Diagnostics endpoint error', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      recentLogs: logger.getLogs().slice(-10)
    }, { status: 500 });
  }
}