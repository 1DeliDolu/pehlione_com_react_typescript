import type { RequestHandler } from "express";
import { getProfile, updateProfile, changePassword } from "./users.service.js";
import { updateProfileSchema, changePasswordSchema } from "@pehlione/shared";

export const getMeController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getProfile(req.session.userId!);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateMeController: RequestHandler = async (req, res, next) => {
  try {
    const parsed = updateProfileSchema.parse(req.body);
    const data = await updateProfile(req, req.session.userId!, parsed);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const changePasswordController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const parsed = changePasswordSchema.parse(req.body);
    await changePassword(req, req.session.userId!, parsed);
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};
