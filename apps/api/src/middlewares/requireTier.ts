import type { Request, Response, NextFunction } from "express";
import type { MembershipTier } from "@pehlione/shared";

import { AppError } from "./errorHandler.js";

export function requireTier(...tiers: MembershipTier[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.session.userId) {
      next(new AppError(401, "Authentication required"));
      return;
    }
    if (
      !req.session.membershipTier ||
      !tiers.includes(req.session.membershipTier)
    ) {
      next(
        new AppError(
          403,
          `This feature requires one of: ${tiers.join(", ")} tier`,
        ),
      );
      return;
    }
    next();
  };
}
