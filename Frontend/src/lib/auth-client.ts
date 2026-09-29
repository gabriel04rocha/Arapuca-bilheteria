import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, user, admin } from "../config/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include",
  },
  basePath: "/auth",
  plugins: [
    adminClient({
      ac,
      roles: {
        user,
        admin,
      },
    }),
  ],
});
