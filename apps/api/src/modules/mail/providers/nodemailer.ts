import nodemailer, { Transporter } from "nodemailer";

import { env } from "../../../config/env.js";

let transporter: Transporter | null = null;

export function getMailTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_SECURE,
      auth:
        env.MAIL_USER && env.MAIL_PASS
          ? { user: env.MAIL_USER, pass: env.MAIL_PASS }
          : undefined,
    });
  }
  return transporter;
}
