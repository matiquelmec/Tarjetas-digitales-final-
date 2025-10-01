// Simplified auth configuration for production debugging
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptionsProduction: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log('JWT callback - token exists:', !!token, 'user exists:', !!user);

      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },
    session: async ({ session, token }) => {
      console.log('Session callback - session exists:', !!session, 'token exists:', !!token);

      if (token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  debug: true,
};