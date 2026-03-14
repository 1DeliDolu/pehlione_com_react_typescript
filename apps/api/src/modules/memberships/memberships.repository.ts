import { prisma } from "../../lib/prisma.js";

export async function getMembershipByUser(userId: string) {
  return prisma.userMembership.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });
}

export async function getEntitlementsByTier(tier: string) {
  return prisma.featureEntitlement.findMany({
    where: { tier: tier as never },
    include: { feature: true },
  });
}

export async function getAllFeatureEntitlements() {
  return prisma.featureEntitlement.findMany({
    include: { feature: true },
    orderBy: [{ tier: "asc" }, { featureKey: "asc" }],
  });
}
