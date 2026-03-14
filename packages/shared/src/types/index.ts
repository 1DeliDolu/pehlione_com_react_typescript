import type { Role, MembershipTier, MembershipStatus } from "../enums/index.js";

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  membershipTier: MembershipTier;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSessionDto {
  id: string;
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  lastActiveAt: string;
  expiresAt: string;
  createdAt: string;
  isCurrent?: boolean;
}

export interface UserMembershipDto {
  id: string;
  tier: MembershipTier;
  status: MembershipStatus;
  startedAt: string;
  endedAt: string | null;
}

export interface FeatureEntitlementDto {
  feature: string;
  value: string;
}

export interface AuditLogDto {
  id: string;
  actorUserId: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
