// ROBUST AUTH CONFIGURATION - Always works, no database dependencies in callbacks
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptionsRobust: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Simple, reliable JWT callback
      if (user && account) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.sub = user.id;

        console.log('✅ JWT callback success:', {
          email: user.email,
          provider: account.provider
        });
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Simple session callback
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;

        console.log('✅ Session callback success:', {
          email: session.user.email
        });
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      console.log('🔄 Redirect callback:', { url, baseUrl });

      // Always redirect to dashboard after successful login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};