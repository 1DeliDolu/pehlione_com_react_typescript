import type { RequestHandler } from "express";
import {
  listUsers,
  adminGetUser,
  adminChangeRole,
  adminChangeTier,
  adminDisableUser,
  adminEnableUser,
} from "../users/users.service.js";
import { findAuditLogs } from "../audit/audit.repository.js";
import type { Role, MembershipTier } from "@pehlione/shared";
import { Role as RoleEnum, MembershipTier as TierEnum } from "@pehlione/shared";
import { z } from "zod";

const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.nativeEnum(RoleEnum).optional(),
  membershipTier: z.nativeEnum(TierEnum).optional(),
  isActive: z
    .string()
    .transform((v) => (v === "true" ? true : v === "false" ? false : undefined))
    .optional(),
});

export const listUsersController: RequestHandler = async (req, res, next) => {
  try {
    const query = listUsersQuerySchema.parse(req.query);
    const { data, total } = await listUsers({
      page: query.page,
      limit: query.limit,
      search: query.search,
      role: query.role,
      membershipTier: query.membershipTier,
      isActive: query.isActive as boolean | undefined,
    });
    res.json({
      success: true,
      data,
      meta: { total, page: query.page, limit: query.limit },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserController: RequestHandler = async (req, res, next) => {
  try {
    const data = await adminGetUser(req.params.userId as string);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const changeRoleController: RequestHandler = async (req, res, next) => {
  try {
    const { role } = z.object({ role: z.nativeEnum(RoleEnum) }).parse(req.body);
    await adminChangeRole(req, req.params.userId as string, role as Role);
    res.json({ success: true, message: "Role updated" });
  } catch (err) {
    next(err);
  }
};

export const changeTierController: RequestHandler = async (req, res, next) => {
  try {
    const { membershipTier } = z
      .object({ membershipTier: z.nativeEnum(TierEnum) })
      .parse(req.body);
    await adminChangeTier(
      req,
      req.params.userId as string,
      membershipTier as MembershipTier,
    );
    res.json({ success: true, message: "Membership tier updated" });
  } catch (err) {
    next(err);
  }
};

export const disableUserController: RequestHandler = async (req, res, next) => {
  try {
    await adminDisableUser(req, req.params.userId as string);
    res.json({ success: true, message: "User disabled" });
  } catch (err) {
    next(err);
  }
};

export const enableUserController: RequestHandler = async (req, res, next) => {
  try {
    await adminEnableUser(req, req.params.userId as string);
    res.json({ success: true, message: "User enabled" });
  } catch (err) {
    next(err);
  }
};

export const auditLogsController: RequestHandler = async (req, res, next) => {
  try {
    const query = z
      .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        userId: z.string().optional(),
        action: z.string().optional(),
      })
      .parse(req.query);

    const { data, total } = await findAuditLogs({
      page: query.page,
      limit: query.limit,
      actorUserId: query.userId,
      action: query.action as never,
    });
    res.json({
      success: true,
      data,
      meta: { total, page: query.page, limit: query.limit },
    });
  } catch (err) {
    next(err);
  }
};
