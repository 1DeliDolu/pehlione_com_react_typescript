import type { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma.js";
import { AppError } from "./errorHandler.js";

/**
 * Middleware that checks whether the user's membership tier has a specific
 * feature entitlement enabled in the feature_entitlements table.
 *
 * Usage: requireFeature("analytics")
 * Will check if there's a row matching {tier, feature} and that
 * the value is not "false" or "0".
 */
export function requireFeature(featureKey: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.session.userId) {
      next(new AppError(401, "Authentication required"));
      return;
    }

    const tier = req.session.membershipTier;
    if (!tier) {
      next(new AppError(403, "No membership tier assigned"));
      return;
    }

    const entitlement = await prisma.featureEntitlement.findUnique({
      where: { tier_feature: { tier, feature: featureKey } },
    });

    if (!entitlement || entitlement.value === "false" || entitlement.value === "0") {
      next(
        new AppError(
          403,
          `This feature requires a higher membership tier`,
        ),
      );
      return;
    }

    next();
  };
}
