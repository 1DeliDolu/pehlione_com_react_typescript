import type { CookieOptions } from "express";

import { env } from "../config/env.js";

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: env.SESSION_COOKIE_HTTP_ONLY,
    secure: env.SESSION_COOKIE_SECURE,
    sameSite: env.SESSION_COOKIE_SAME_SITE,
    maxAge: env.SESSION_COOKIE_MAX_AGE,
  };
}
