import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { verifyCsrfToken } from "../../middlewares/csrf.js";
import { validate } from "../../middlewares/validate.js";
import { updateProfileSchema, changePasswordSchema } from "@pehlione/shared";
import {
  getMeController,
  updateMeController,
  changePasswordController,
} from "./users.controller.js";

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/me", getMeController);
usersRouter.patch(
  "/me",
  verifyCsrfToken,
  validate(updateProfileSchema),
  updateMeController,
);
usersRouter.patch(
  "/me/password",
  verifyCsrfToken,
  validate(changePasswordSchema),
  changePasswordController,
);
