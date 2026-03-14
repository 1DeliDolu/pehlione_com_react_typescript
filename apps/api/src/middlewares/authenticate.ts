import type { Request, Response, NextFunction } from "express";

import { AppError } from "./errorHandler.js";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.session.userId) {
    next(new AppError(401, "Authentication required"));
    return;
  }
  next();
}
