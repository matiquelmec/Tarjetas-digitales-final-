// import NextAuth from "next-auth" // Unused import
import { UserStatus } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      status?: UserStatus
    }
    accessToken?: string
  }

  interface User {
    id: string
    status?: UserStatus
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    status?: UserStatus
    accessToken?: string
  }
}