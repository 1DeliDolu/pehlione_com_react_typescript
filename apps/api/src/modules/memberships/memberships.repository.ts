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
    orderBy: { feature: "asc" },
  });
}

export async function getAllFeatureEntitlements() {
  return prisma.featureEntitlement.findMany({
    orderBy: [{ tier: "asc" }, { feature: "asc" }],
  });
}
