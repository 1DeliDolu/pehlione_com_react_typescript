import type { Request, Response, NextFunction } from "express";
import { randomBytes } from "node:crypto";

import { AppError } from "./errorHandler.js";

export function setCsrfToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.session.csrfToken) {
    req.session.csrfToken = randomBytes(32).toString("hex");
  }
  next();
}

export function verifyCsrfToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const safeMethod = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (safeMethod) {
    next();
    return;
  }

  const headerToken = req.headers["x-csrf-token"] as string | undefined;
  const sessionToken = req.session.csrfToken;

  if (!headerToken || !sessionToken || headerToken !== sessionToken) {
    next(new AppError(403, "Invalid CSRF token"));
    return;
  }
  next();
}
