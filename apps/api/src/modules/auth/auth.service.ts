import type { Request } from "express";

import { AuditAction } from "@pehlione/shared";
import { AppError } from "../../middlewares/errorHandler.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { generateToken, hashToken } from "../../lib/token.js";
import { logAction } from "../audit/audit.service.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "../mail/mail.service.js";
import * as repo from "./auth.repository.js";

export async function register(
  req: Request,
  input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  },
) {
  const existing = await repo.findUserByEmail(input.email);
  if (existing) {
    throw new AppError(409, "Bu e-posta adresi zaten kayıtlı");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await repo.createUser({
    email: input.email.toLowerCase().trim(),
    passwordHash,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
  });

  // Email verification token (24h)
  const { raw, hash } = generateToken();
  await repo.createEmailVerificationToken(
    user.id,
    hash,
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );

  await Promise.allSettled([
    sendWelcomeEmail(user.email, user.firstName),
    sendVerificationEmail(user.email, user.firstName, raw),
    logAction(req, AuditAction.USER_CREATED, "user", user.id),
  ]);

  return user;
}

export async function login(
  req: Request,
  input: { email: string; password: string },
) {
  const user = await repo.findUserByEmail(input.email.toLowerCase().trim());

  if (!user) {
    await logAction(req, AuditAction.LOGIN_FAILED, "user", null, {
      email: input.email,
      reason: "user_not_found",
    });
    throw new AppError(401, "E-posta veya şifre hatalı");
  }

  if (!user.isActive) {
    await logAction(req, AuditAction.LOGIN_FAILED, "user", user.id, {
      reason: "account_disabled",
    });
    throw new AppError(403, "Hesabınız devre dışı bırakıldı");
  }

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) {
    await logAction(req, AuditAction.LOGIN_FAILED, "user", user.id, {
      reason: "invalid_password",
    });
    throw new AppError(401, "E-posta veya şifre hatalı");
  }

  // Rotate session after login
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.membershipTier = user.membershipTier;

  await repo.updateUser(user.id, { lastLoginAt: new Date() });
  await logAction(req, AuditAction.LOGIN_SUCCEEDED, "user", user.id);

  return user;
}

export async function logout(req: Request) {
  const userId = req.session.userId;
  await new Promise<void>((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });
  if (userId) {
    // Fire and forget
    logAction(
      { ...req, session: { userId } } as unknown as Request,
      AuditAction.LOGOUT_SUCCEEDED,
      "user",
      userId,
    ).catch(() => {});
  }
}

export async function getMe(userId: string) {
  const user = await repo.findUserById(userId);
  if (!user || !user.isActive) {
    throw new AppError(401, "Authentication required");
  }
  return user;
}

export async function verifyEmail(req: Request, token: string) {
  const hash = hashToken(token);
  const record = await repo.findEmailVerificationToken(hash);

  if (!record || record.usedAt !== null) {
    throw new AppError(
      400,
      "Bu doğrulama bağlantısı geçersiz veya kullanılmış",
    );
  }
  if (record.expiresAt < new Date()) {
    throw new AppError(400, "Doğrulama bağlantısının süresi dolmuş");
  }

  await Promise.all([
    repo.markEmailVerificationTokenUsed(record.id),
    repo.updateUser(record.userId, { isEmailVerified: true }),
  ]);

  await logAction(req, AuditAction.EMAIL_VERIFIED, "user", record.userId);
}

export async function forgotPassword(req: Request, email: string) {
  const user = await repo.findUserByEmail(email.toLowerCase().trim());
  // Always return success (prevent email enumeration)
  if (!user || !user.isActive) return;

  const { raw, hash } = generateToken();
  await repo.createPasswordResetToken(
    user.id,
    hash,
    new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  );

  await Promise.allSettled([
    sendPasswordResetEmail(user.email, user.firstName, raw),
    logAction(req, AuditAction.PASSWORD_RESET_REQUESTED, "user", user.id),
  ]);
}

export async function resetPassword(
  req: Request,
  token: string,
  newPassword: string,
) {
  const hash = hashToken(token);
  const record = await repo.findPasswordResetToken(hash);

  if (!record || record.usedAt !== null) {
    throw new AppError(
      400,
      "Bu şifre sıfırlama bağlantısı geçersiz veya kullanılmış",
    );
  }
  if (record.expiresAt < new Date()) {
    throw new AppError(400, "Şifre sıfırlama bağlantısının süresi dolmuş");
  }

  const user = await repo.findUserById(record.userId);
  if (!user || !user.isActive) {
    throw new AppError(400, "Kullanıcı bulunamadı");
  }

  const passwordHash = await hashPassword(newPassword);
  await Promise.all([
    repo.markPasswordResetTokenUsed(record.id),
    repo.updateUser(record.userId, { passwordHash }),
  ]);

  await Promise.allSettled([
    sendPasswordChangedEmail(user.email, user.firstName),
    logAction(req, AuditAction.PASSWORD_RESET_COMPLETED, "user", user.id),
  ]);
}
