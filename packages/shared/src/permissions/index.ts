import { Role, MembershipTier } from "../enums/index.js";

// Role-based permissions
export const PERMISSIONS = {
  ADMIN_PANEL_ACCESS: "admin.panel.access",
  USER_READ_SELF: "user.read.self",
  USER_UPDATE_SELF: "user.update.self",
  USER_READ_ALL: "user.read.all",
  USER_UPDATE_TIER: "user.update.tier",
  USER_UPDATE_ROLE: "user.update.role",
  USER_DISABLE: "user.disable",
  AUDIT_READ: "audit.read",
  SESSION_READ_SELF: "session.read.self",
  SESSION_REVOKE_SELF: "session.revoke.self",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Default role → permission mappings
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(PERMISSIONS) as Permission[],
  [Role.USER]: [
    PERMISSIONS.USER_READ_SELF,
    PERMISSIONS.USER_UPDATE_SELF,
    PERMISSIONS.SESSION_READ_SELF,
    PERMISSIONS.SESSION_REVOKE_SELF,
  ],
};

// Tier-based feature entitlements
export const FEATURES = {
  ANALYTICS_BASIC: "feature.analytics.basic",
  ANALYTICS_ADVANCED: "feature.analytics.advanced",
  EXPORT_CSV: "feature.export.csv",
  PRIORITY_SUPPORT: "feature.priority.support",
  TEAM_INVITES: "feature.team.invites",
  LIMIT_PROJECTS: "limit.projects",
  LIMIT_STORAGE_MB: "limit.storageMb",
  LIMIT_API_REQUESTS_PER_DAY: "limit.apiRequestsPerDay",
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];

export const TIER_ENTITLEMENTS: Record<
  MembershipTier,
  Record<Feature, string>
> = {
  [MembershipTier.BRONZE]: {
    [FEATURES.ANALYTICS_BASIC]: "true",
    [FEATURES.ANALYTICS_ADVANCED]: "false",
    [FEATURES.EXPORT_CSV]: "false",
    [FEATURES.PRIORITY_SUPPORT]: "false",
    [FEATURES.TEAM_INVITES]: "false",
    [FEATURES.LIMIT_PROJECTS]: "1",
    [FEATURES.LIMIT_STORAGE_MB]: "100",
    [FEATURES.LIMIT_API_REQUESTS_PER_DAY]: "100",
  },
  [MembershipTier.SILVER]: {
    [FEATURES.ANALYTICS_BASIC]: "true",
    [FEATURES.ANALYTICS_ADVANCED]: "true",
    [FEATURES.EXPORT_CSV]: "true",
    [FEATURES.PRIORITY_SUPPORT]: "true",
    [FEATURES.TEAM_INVITES]: "false",
    [FEATURES.LIMIT_PROJECTS]: "5",
    [FEATURES.LIMIT_STORAGE_MB]: "1024",
    [FEATURES.LIMIT_API_REQUESTS_PER_DAY]: "1000",
  },
  [MembershipTier.GOLD]: {
    [FEATURES.ANALYTICS_BASIC]: "true",
    [FEATURES.ANALYTICS_ADVANCED]: "true",
    [FEATURES.EXPORT_CSV]: "true",
    [FEATURES.PRIORITY_SUPPORT]: "true",
    [FEATURES.TEAM_INVITES]: "true",
    [FEATURES.LIMIT_PROJECTS]: "unlimited",
    [FEATURES.LIMIT_STORAGE_MB]: "102400",
    [FEATURES.LIMIT_API_REQUESTS_PER_DAY]: "unlimited",
  },
};
