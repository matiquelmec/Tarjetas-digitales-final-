import NextAuth from "next-auth";
import { authOptionsSafe } from "@/lib/auth-safe";
import { authOptionsDevelopment } from "@/lib/auth-development";
import { authOptionsProduction } from "@/lib/auth-production";

// Use development auth config if SKIP_GOOGLE_AUTH is set
// Temporarily use simplified production config for debugging
const authOptions = process.env.SKIP_GOOGLE_AUTH === 'true'
  ? authOptionsDevelopment
  : (process.env.NODE_ENV === 'production' ? authOptionsProduction : authOptionsSafe);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };