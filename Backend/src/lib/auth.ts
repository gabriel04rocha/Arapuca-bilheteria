import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma.js"
import { env } from "../config/env.js"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    trustedOrigins: env.trustedOrigins,

    emailAndPassword: {
        enabled: true
    }
})