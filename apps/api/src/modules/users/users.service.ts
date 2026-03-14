import { AppError } from "../../middlewares/errorHandler.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import {
  findUserById,
  updateUserProfile,
  updateUserPassword,
  findAllUsers,
  updateUserRole,
  updateUserTier,
  updateUserStatus,
} from "./users.repository.js";
import { logAction } from "../audit/audit.service.js";
import { AuditAction } from "@pehlione/shared";
import type { Request } from "express";
import type { Role, MembershipTier } from "@pehlione/shared";
import type { UpdateProfileInput, ChangePasswordInput } from "@pehlione/shared";

export async function getProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, "User not found");
  const { passwordHash: _ph, ...safe } = user;
  return safe;
}

export async function updateProfile(
  req: Request,
  userId: string,
  data: UpdateProfileInput,
) {
  const updated = await updateUserProfile(userId, data);
  await logAction(req, AuditAction.USER_UPDATED, "User", userId);
  const { passwordHash: _ph, ...safe } = updated;
  return safe;
}

export async function changePassword(
  req: Request,
  userId: string,
  data: ChangePasswordInput,
) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, "User not found");

  const valid = await verifyPassword(user.passwordHash, data.currentPassword);
  if (!valid) throw new AppError(400, "Current password is incorrect");

  if (data.newPassword === data.currentPassword)
    throw new AppError(400, "New password must differ from current password");

  const hash = await hashPassword(data.newPassword);
  await updateUserPassword(userId, hash);
  await logAction(req, AuditAction.PASSWORD_CHANGED, "User", userId);
}

export async function listUsers(opts: {
  page: number;
  limit: number;
  search?: string;
  role?: Role;
  membershipTier?: MembershipTier;
  isActive?: boolean;
}) {
  return findAllUsers(opts);
}

export async function adminGetUser(id: string) {
  const user = await findUserById(id);
  if (!user) throw new AppError(404, "User not found");
  const { passwordHash: _ph, ...safe } = user;
  return safe;
}

export async function adminChangeRole(
  req: Request,
  userId: string,
  role: Role,
) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, "User not found");
  await updateUserRole(userId, role);
  await logAction(req, AuditAction.ROLE_UPDATED, "User", userId, { role });
}

export async function adminChangeTier(
  req: Request,
  userId: string,
  membershipTier: MembershipTier,
) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, "User not found");
  await updateUserTier(userId, membershipTier);
  await logAction(req, AuditAction.MEMBERSHIP_TIER_UPDATED, "User", userId, {
    membershipTier,
  });
}

export async function adminDisableUser(req: Request, userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, "User not found");
  if (!user.isActive) throw new AppError(400, "User is already disabled");
  await updateUserStatus(userId, false);
  await logAction(req, AuditAction.ACCOUNT_DISABLED, "User", userId);
}

export async function adminEnableUser(req: Request, userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, "User not found");
  if (user.isActive) throw new AppError(400, "User is already active");
  await updateUserStatus(userId, true);
  await logAction(req, AuditAction.ACCOUNT_ENABLED, "User", userId);
}
