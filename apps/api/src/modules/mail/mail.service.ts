import { getMailTransporter } from "./providers/nodemailer.js";
import { env } from "../../config/env.js";

const FROM = `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM_ADDRESS}>`;

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const link = `${env.APP_ORIGIN}/verify-email?token=${token}`;
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Verify your email address",
    html: `
      <h2>Hello ${name},</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
      <p>This link is valid for 24 hours.</p>
      <p>If you did not make this request, you can safely ignore this email.</p>
    `,
    text: `Verify your account by visiting this link: ${link}`,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const link = `${env.APP_ORIGIN}/reset-password?token=${token}`;
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Password reset request",
    html: `
      <h2>Hello ${name},</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>This link is valid for 1 hour.</p>
      <p>If you did not make this request, your password will not be changed.</p>
    `,
    text: `Reset your password by visiting this link: ${link}`,
  });
}

export async function sendPasswordChangedEmail(
  to: string,
  name: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Your password has been changed",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your account password has been successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    `,
    text: `Your account password has been changed. If this wasn't you, please contact support.`,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: `Welcome, ${name}!`,
    html: `
      <h2>Hello ${name},</h2>
      <p>Welcome to Pehlione! Your account has been created successfully.</p>
      <p>Don't forget to verify your email address to get started.</p>
    `,
    text: `Hello ${name}, welcome to Pehlione!`,
  });
}

export async function sendMembershipUpgradedEmail(
  to: string,
  name: string,
  newTier: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Your membership plan has been updated",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your membership plan has been updated to <strong>${newTier}</strong>.</p>
      <p>Sign in to your account to explore your new features.</p>
    `,
    text: `Your membership plan has been updated to ${newTier}.`,
  });
}

export async function sendAccountDisabledEmail(
  to: string,
  name: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Your account has been disabled",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your account has been disabled by an administrator.</p>
      <p>Please contact our support team for more information.</p>
    `,
    text: `Your account has been disabled. Please contact support.`,
  });
}
