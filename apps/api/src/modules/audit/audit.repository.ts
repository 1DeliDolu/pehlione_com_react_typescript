import type { AuditAction } from "@pehlione/shared";

import { prisma } from "../../lib/prisma.js";

export interface CreateAuditLogInput {
  actorUserId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
}

export async function createAuditLog(
  input: CreateAuditLogInput,
): Promise<void> {
  await prisma.auditLog.create({ data: input });
}

export async function findAuditLogs(opts: {
  page: number;
  limit: number;
  actorUserId?: string;
  action?: AuditAction;
}) {
  const skip = (opts.page - 1) * opts.limit;
  const where = {
    ...(opts.actorUserId ? { actorUserId: opts.actorUserId } : {}),
    ...(opts.action ? { action: opts.action } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: opts.limit,
      orderBy: { createdAt: "desc" },
      include: { actorUser: { select: { email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, total };
}
