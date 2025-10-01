// DEPRECATED: This auth config causes conflicts with authOptionsSafe 
// All APIs should use authOptionsSafe (auth-safe.ts) for consistency
/*
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Plan } from "@prisma/client";

// Minimal working NextAuth configuration - JWT only
export const authOptionsMinimal: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.userId = user.id;
        token.plan = Plan.FREE; // Default plan
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.plan = token.plan as Plan || Plan.FREE;
      }
      return session;
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
  debug: false, // Disable debug in production
};
*/