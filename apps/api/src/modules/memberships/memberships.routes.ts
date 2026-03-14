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
    const tier = req.session.membershipTier ?? "BRONZE";
    const entitlements = await getEntitlementsByTier(tier);
    const features = entitlements.map((e) => ({
      feature: e.feature,
      value: e.value,
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
