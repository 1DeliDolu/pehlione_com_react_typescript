import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import {
  getMembershipByUser,
  getEntitlementsByTier,
} from "./memberships.repository.js";
import type { RequestHandler } from "express";

const getMembershipController: RequestHandler = async (req, res, next) => {
  try {
    const membership = await getMembershipByUser(req.session.userId!);
    res.json({ success: true, data: membership });
  } catch (err) {
    next(err);
  }
};

const getFeaturesController: RequestHandler = async (req, res, next) => {
  try {
    const tier = req.session.membershipTier ?? "FREE";
    const entitlements = await getEntitlementsByTier(tier);
    const features = entitlements.map((e) => ({
      featureKey: e.featureKey,
      name: (e as Record<string, unknown> & { feature?: { name: string } })
        .feature?.name,
      limitValue: e.limitValue,
      isEnabled: e.isEnabled,
    }));
    res.json({ success: true, data: features });
  } catch (err) {
    next(err);
  }
};

export const membershipsRouter = Router();

membershipsRouter.use(authenticate);
membershipsRouter.get("/me", getMembershipController);
membershipsRouter.get("/features/me", getFeaturesController);
