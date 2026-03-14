import type { Request } from "express";
import type { AuditAction } from "@pehlione/shared";

import { createAuditLog } from "./audit.repository.js";

export async function logAction(
  req: Request,
  action: AuditAction,
  entityType: string,
  entityId?: string | null,
  metadata?: Record<string, unknown> | null,
): Promise<void> {
  await createAuditLog({
    actorUserId: req.session.userId ?? null,
    action,
    entityType,
    entityId: entityId ?? null,
    ipAddress:
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
      req.ip ??
      null,
    userAgent: req.headers["user-agent"] ?? null,
    metadata: metadata ?? null,
  });
}
