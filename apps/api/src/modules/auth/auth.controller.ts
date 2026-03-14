import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@pehlione/shared";
import { validate } from "../../middlewares/validate.js";
import * as authService from "./auth.service.js";

export const registerValidator = validate(registerSchema);
export const loginValidator = validate(loginSchema);
export const forgotPasswordValidator = validate(forgotPasswordSchema);
export const resetPasswordValidator = validate(resetPasswordSchema);
export const verifyEmailValidator = validate(verifyEmailSchema, "query");

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.register(req, req.body);
    res.status(201).json({
      success: true,
      message: "Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.",
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.login(req, req.body);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        membershipTier: user.membershipTier,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.logout(req);
    res.clearCookie("pehlione.sid");
    res.status(200).json({ success: true, message: "Çıkış başarılı" });
  } catch (err) {
    next(err);
  }
}

export async function meController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.getMe(req.session.userId!);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        membershipTier: user.membershipTier,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmailController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.verifyEmail(req, req.query["token"] as string);
    res.status(200).json({ success: true, message: "E-posta doğrulandı" });
  } catch (err) {
    next(err);
  }
}

export async function forgotPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.forgotPassword(req, req.body.email);
    res.status(200).json({
      success: true,
      message:
        "E-posta adresiniz kayıtlıysa şifre sıfırlama bağlantısı gönderildi",
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.resetPassword(req, req.body.token, req.body.password);
    res
      .status(200)
      .json({ success: true, message: "Şifre başarıyla güncellendi" });
  } catch (err) {
    next(err);
  }
}

export async function csrfController(
  req: Request,
  res: Response,
): Promise<void> {
  res
    .status(200)
    .json({ success: true, data: { csrfToken: req.session.csrfToken } });
}
