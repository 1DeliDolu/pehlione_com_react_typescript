import type { Role, MembershipTier } from "@pehlione/shared";

declare module "express-session" {
  interface SessionData {
    userId: string;
    role: Role;
    membershipTier: MembershipTier;
    csrfToken?: string;
  }
}
