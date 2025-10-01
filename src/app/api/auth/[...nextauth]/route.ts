import NextAuth from "next-auth";
import { authOptionsRobust } from "@/lib/auth-robust";
import { authOptionsDevelopment } from "@/lib/auth-development";

// Use robust auth config - no database dependencies in callbacks
const authOptions = process.env.SKIP_GOOGLE_AUTH === 'true'
  ? authOptionsDevelopment
  : authOptionsRobust;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };