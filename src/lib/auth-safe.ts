// Safe auth configuration that doesn't validate environment variables during build
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

// Basic auth configuration without validation (for build compatibility)
export const authOptionsSafe: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'build-placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'build-placeholder',
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      try {
        console.log('JWT callback - token:', !!token, 'user:', !!user, 'account:', !!account);

        // Always return at minimum a valid token object
        if (!token) {
          token = {};
        }

        if (account && user && user.email) {
          try {
            // Check if user exists in database, if not create them
            let dbUser = await prisma.user.findUnique({
              where: { email: user.email },
            });

            if (!dbUser) {
              console.log('Creating new user in database for email:', user.email);
              // Crear usuario con trial automático de 7 días
              const now = new Date();
              const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

              dbUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || '',
                  image: user.image || '',
                  status: 'TRIAL',
                  trialStartDate: now,
                  trialEndDate: trialEndDate,
                  isFirstYear: true,
                },
              });
              console.log('User created successfully:', dbUser.id);
            } else {
              console.log('User found in database:', dbUser.id);
            }

            token.userId = dbUser.id;
            token.status = dbUser.status;
            token.email = dbUser.email;
            console.log('Token updated with userId:', dbUser.id, 'status:', dbUser.status);
          } catch (error) {
            console.error('Error in JWT callback:', error);
            // Fallback but ensure we have the minimum required data
            token.userId = user.id || user.email;
            token.status = 'TRIAL'; // Use string literal instead of enum
            token.email = user.email;
          }
        }
      } catch (error) {
        console.error('Critical error in JWT callback:', error);
        // Return token as-is to prevent complete failure
      }

      return token;
    },
    session: async ({ session, token }) => {
      try {
        console.log('Session callback - session:', !!session, 'token:', !!token);

        // Always return a valid session object
        if (!session) {
          return null;
        }

        if (token && session?.user) {
          // Ensure we always use the database ID, not the OAuth ID
          if (session.user.email) {
            try {
              const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email }
              });
              if (dbUser) {
                session.user.id = dbUser.id; // Use database ID
                session.user.status = dbUser.status;
                console.log('Session user ID set to database ID:', dbUser.id);
              } else {
                session.user.id = token.userId as string;
                session.user.status = token.status || 'TRIAL';
                console.log('Session user ID set to token ID:', token.userId);
              }
            } catch (error) {
              console.error('Error fetching user in session callback:', error);
              session.user.id = token.userId as string || 'fallback-id';
              session.user.status = token.status || 'TRIAL';
            }
          } else {
            session.user.id = token.userId as string || 'fallback-id';
            session.user.status = token.status || 'TRIAL';
          }
        }
      } catch (error) {
        console.error('Critical error in session callback:', error);
        // Return session as-is to prevent complete failure
      }

      return session;
    },
    signIn: async ({ user }) => {
      console.log('SignIn callback - user:', user.email);
      return true;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? 'tarjetasdigitales.netlify.app' : undefined
      }
    },
  },
  pages: {
    error: '/auth/error',
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
};