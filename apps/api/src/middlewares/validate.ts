import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

import { AppError } from "./errorHandler.js";

type Target = "body" | "query" | "params";

export function validate(schema: ZodSchema, target: Target = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      next(new AppError(422, "Validation failed", errors));
      return;
    }
    req[target] = result.data;
    next();
  };
}

function formatZodErrors(err: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_root";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
