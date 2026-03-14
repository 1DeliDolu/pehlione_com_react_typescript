import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { setCsrfToken, verifyCsrfToken } from "../../middlewares/csrf.js";
import {
  registerController,
  registerValidator,
  loginController,
  loginValidator,
  logoutController,
  meController,
  verifyEmailController,
  verifyEmailValidator,
  forgotPasswordController,
  forgotPasswordValidator,
  resetPasswordController,
  resetPasswordValidator,
  csrfController,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.get("/csrf-token", setCsrfToken, csrfController);
authRouter.post("/register", verifyCsrfToken, registerValidator, registerController);
authRouter.post("/login", verifyCsrfToken, loginValidator, loginController);
authRouter.post("/logout", authenticate, logoutController);
authRouter.get("/me", authenticate, meController);
authRouter.get("/verify-email", verifyEmailValidator, verifyEmailController);
authRouter.post(
  "/forgot-password",
  verifyCsrfToken,
  forgotPasswordValidator,
  forgotPasswordController,
);
authRouter.post(
  "/reset-password",
  verifyCsrfToken,
  resetPasswordValidator,
  resetPasswordController,
);
