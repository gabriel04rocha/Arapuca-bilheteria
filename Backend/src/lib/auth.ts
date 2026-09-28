import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma.js";
import { env } from "../config/env.js";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, user, admin } from "../config/permissions.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: env.apiBaseUrl,

  trustedOrigins: env.trustedOrigins,

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    adminPlugin({
      ac,
      roles: {
        user,
        admin,
      },
    }),
  ],
});
