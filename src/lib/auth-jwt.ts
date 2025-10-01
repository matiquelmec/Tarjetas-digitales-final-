import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Plan } from "@prisma/client";
import { logger } from "./logger";
import { env } from "./env";

// JWT-based authentication (more stable than database sessions)
export const authOptionsJWT: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      logger.debug('JWT callback triggered', { 
        hasToken: !!token, 
        hasUser: !!user,
        hasAccount: !!account 
      });

      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        token.userId = user.id;
        token.plan = Plan.FREE; // Default plan
        
        logger.debug('JWT token created for new user', { 
          userId: user.id, 
          email: user.email 
        });
      }
      
      return token;
    },
    async session({ session, token }) {
      logger.debug('Session callback (JWT) triggered', { 
        hasSession: !!session, 
        hasToken: !!token 
      });

      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.plan = token.plan as Plan || Plan.FREE;
        session.accessToken = token.accessToken as string;
        
        logger.debug('Session populated from JWT token', { 
          userId: session.user.id, 
          plan: session.user.plan 
        });
      }
      
      return session;
    },
    async signIn({ user, account }) {
      logger.debug('SignIn callback (JWT) triggered', {
        provider: account?.provider,
        userEmail: user?.email
      });
      
      try {
        // Allow all Google sign-ins
        return true;
      } catch (error) {
        logger.error('SignIn callback (JWT) error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userEmail: user?.email,
          provider: account?.provider
        });
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    error: '/auth/error',
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      logger.error(`NextAuth JWT Error [${code}]`, metadata);
    },
    warn(code) {
      logger.warn(`NextAuth JWT Warning [${code}]`);
    },
    debug(code, metadata) {
      logger.debug(`NextAuth JWT Debug [${code}]`, metadata);
    },
  },
};