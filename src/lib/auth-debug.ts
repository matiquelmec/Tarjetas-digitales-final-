import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Minimal auth configuration for debugging
export const authOptionsDebug: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      console.log('JWT callback:', { token: !!token, user: !!user, account: !!account });
      if (account && user) {
        token.userId = user.id;
        token.email = user.email;
        console.log('JWT token updated with user data');
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log('Session callback:', { session: !!session, token: !!token });
      if (token && session.user) {
        session.user.id = token.userId as string;
        console.log('Session updated with user ID:', session.user.id);
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    error: '/auth/error',
    signIn: '/',
  },
  debug: true,
};