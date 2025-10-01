// DEPRECATED: This auth config causes conflicts with authOptionsSafe 
// All APIs should use authOptionsSafe (auth-safe.ts) for consistency
// import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import { logger } from "./logger";
import { env, validateRuntimeEnvironment, isBuildTime } from "./env";

// Validate environment at runtime (not build time)
if (!isBuildTime) {
  const validation = validateRuntimeEnvironment();
  if (!validation.isValid) {
    logger.warn('Environment validation issues found', validation.errors);
  } else {
    logger.info('Environment validation passed');
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      logger.debug('Session callback triggered', { 
        hasSession: !!session, 
        hasUser: !!user,
        userId: user?.id 
      });
      
      try {
        if (session?.user && user?.id) {
          session.user.id = user.id;
          
          // Get user's plan from database
          logger.debug('Fetching user plan from database', { userId: user.id });
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { plan: true }
          });
          
          session.user.plan = dbUser?.plan || 'FREE';
          logger.debug('User plan fetched successfully', { 
            userId: user.id, 
            plan: session.user.plan 
          });
        }
        return session;
      } catch (error) {
        logger.error('Session callback error', { 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          userId: user?.id
        });
        return session;
      }
    },
    signIn: async ({ user, account, profile }) => {
      logger.debug('SignIn callback triggered', {
        hasUser: !!user,
        hasAccount: !!account,
        hasProfile: !!profile,
        provider: account?.provider,
        userEmail: user?.email
      });
      
      try {
        return true;
      } catch (error) {
        logger.error('SignIn callback error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          userEmail: user?.email,
          provider: account?.provider
        });
        return false;
      }
    },
  },
  session: {
    strategy: "database",
  },
  pages: {
    error: '/auth/error',
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      logger.error(`NextAuth Error [${code}]`, metadata);
    },
    warn(code) {
      logger.warn(`NextAuth Warning [${code}]`);
    },
    debug(code, metadata) {
      logger.debug(`NextAuth Debug [${code}]`, metadata);
    },
  },
};