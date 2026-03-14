import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
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

adminRouter.get("/users", listUsersController);
adminRouter.get("/users/:userId", getUserController);
adminRouter.patch("/users/:userId/role", verifyCsrfToken, changeRoleController);
adminRouter.patch(
  "/users/:userId/membership",
  verifyCsrfToken,
  changeTierController,
);
adminRouter.post(
  "/users/:userId/disable",
  verifyCsrfToken,
  disableUserController,
);
adminRouter.post(
  "/users/:userId/enable",
  verifyCsrfToken,
  enableUserController,
);
adminRouter.get("/audit-logs", auditLogsController);
