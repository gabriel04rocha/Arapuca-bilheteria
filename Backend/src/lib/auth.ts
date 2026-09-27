import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma.mjs"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    trustedOrigins: ["http://localhost:3000"],

    emailAndPassword: {
        enabled: true
    }
})