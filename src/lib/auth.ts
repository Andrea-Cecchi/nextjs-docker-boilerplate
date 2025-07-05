import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db";
 
export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {  
        enabled: true,
        requireEmailVerification: false,
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
    },
    plugins: [
        nextCookies()
    ],
    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ],
});