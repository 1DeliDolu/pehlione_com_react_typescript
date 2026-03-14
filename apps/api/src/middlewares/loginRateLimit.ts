import rateLimit from "express-rate-limit";

/**
 * Stricter rate limiter for auth endpoints (login, register, forgot-password)
 * to protect against brute-force / credential-stuffing attacks.
 *
 * 10 attempts per 15-minute window, per IP.
 */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});
