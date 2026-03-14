import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { requirePermission } from "../../middlewares/requirePermission.js";
import { verifyCsrfToken } from "../../middlewares/csrf.js";
import { Role } from "@pehlione/shared";
import {
  listUsersController,
  getUserController,
  changeRoleController,
  changeTierController,
  disableUserController,
  enableUserController,
  auditLogsController,
} from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole(Role.ADMIN));

adminRouter.get("/users", requirePermission("users:read"), listUsersController);
adminRouter.get(
  "/users/:userId",
  requirePermission("users:read"),
  getUserController,
);
adminRouter.patch(
  "/users/:userId/role",
  verifyCsrfToken,
  requirePermission("roles:write"),
  changeRoleController,
);
adminRouter.patch(
  "/users/:userId/membership",
  verifyCsrfToken,
  requirePermission("memberships:write"),
  changeTierController,
);
adminRouter.post(
  "/users/:userId/disable",
  verifyCsrfToken,
  requirePermission("users:write"),
  disableUserController,
);
adminRouter.post(
  "/users/:userId/enable",
  verifyCsrfToken,
  requirePermission("users:write"),
  enableUserController,
);
adminRouter.get(
  "/audit-logs",
  requirePermission("audit:read"),
  auditLogsController,
);
