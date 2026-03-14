import type { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma.js";
import { AppError } from "./errorHandler.js";

/**
 * Middleware that checks whether the user's role has the required
 * permission(s) in the role_permissions table.
 */
export function requirePermission(...permissionNames: string[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.session.userId || !req.session.role) {
      next(new AppError(401, "Authentication required"));
      return;
    }

    const count = await prisma.rolePermission.count({
      where: {
        role: req.session.role,
        permissionName: { in: permissionNames },
      },
    });

    if (count < permissionNames.length) {
      next(new AppError(403, "Insufficient permissions"));
      return;
    }

    next();
  };
}
