import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  project: [
    "create",
    "share",
    "update",
    "delete",
    "read_guests",
    "set-password",
    "set-email",
    "send_email",
  ],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  project: ["read_guests"],
});

export const admin = ac.newRole({
  project: ["read_guests", "send_email"],
  ...adminAc.statements,
});
