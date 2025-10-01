// Development auth configuration without Google OAuth
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";

export const authOptionsDevelopment: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'development-secret',
  providers: [
    CredentialsProvider({
      id: "development",
      name: "Development Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dev@example.com" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // In development, allow any email to login
        return {
          id: "dev-user-1",
          email: credentials.email,
          name: "Usuario de Desarrollo",
          image: "/logo.png"
        };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      try {
        if (user && user.email) {
          // Check if user exists in database, if not create them
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!dbUser) {
            console.log('Creating development user in database for email:', user.email);
            const now = new Date();
            const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || 'Usuario de Desarrollo',
                image: user.image || '/logo.png',
                status: 'TRIAL',
                trialStartDate: now,
                trialEndDate: trialEndDate,
                isFirstYear: true,
              },
            });
          }

          token.userId = dbUser.id;
          token.status = dbUser.status;
          token.email = dbUser.email;
        }
      } catch (error) {
        console.error('Error in development JWT callback:', error);
        token.userId = user?.id || user?.email || 'dev-fallback';
        token.status = 'TRIAL';
        token.email = user?.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      try {
        if (token && session?.user) {
          session.user.id = token.userId as string || 'dev-user';
          session.user.status = token.status || 'TRIAL';
        }
      } catch (error) {
        console.error('Error in development session callback:', error);
      }

      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/dev-login',
    error: '/auth/error',
  },
  debug: true,
};