import type { Request, Response, NextFunction } from "express";
import type { Role } from "@pehlione/shared";

import { AppError } from "./errorHandler.js";

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.session.userId) {
      next(new AppError(401, "Authentication required"));
      return;
    }
    if (!req.session.role || !roles.includes(req.session.role)) {
      next(new AppError(403, "Insufficient role"));
      return;
    }
    next();
  };
}
