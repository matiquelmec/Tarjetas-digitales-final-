import NextAuth from "next-auth";
import { authOptionsSafe } from "@/lib/auth-safe";
import { authOptionsDevelopment } from "@/lib/auth-development";

// Use development auth config if SKIP_GOOGLE_AUTH is set
const authOptions = process.env.SKIP_GOOGLE_AUTH === 'true'
  ? authOptionsDevelopment
  : authOptionsSafe;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };