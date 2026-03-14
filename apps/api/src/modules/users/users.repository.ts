import { prisma } from "../../lib/prisma.js";
import type { Role, MembershipTier } from "@pehlione/shared";

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUserProfile(
  id: string,
  data: { firstName?: string; lastName?: string },
) {
  return prisma.user.update({ where: { id }, data });
}

export async function updateUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({ where: { id }, data: { passwordHash } });
}

export async function findAllUsers(opts: {
  page: number;
  limit: number;
  search?: string;
  role?: Role;
  membershipTier?: MembershipTier;
  isActive?: boolean;
}) {
  const skip = (opts.page - 1) * opts.limit;
  const where = {
    ...(opts.search
      ? {
          OR: [
            { email: { contains: opts.search } },
            { firstName: { contains: opts.search } },
            { lastName: { contains: opts.search } },
          ],
        }
      : {}),
    ...(opts.role !== undefined ? { role: opts.role } : {}),
    ...(opts.membershipTier !== undefined
      ? { membershipTier: opts.membershipTier }
      : {}),
    ...(opts.isActive !== undefined ? { isActive: opts.isActive } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: opts.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        membershipTier: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
}

export async function updateUserRole(id: string, role: Role) {
  return prisma.user.update({ where: { id }, data: { role } });
}

export async function updateUserTier(
  id: string,
  membershipTier: MembershipTier,
) {
  return prisma.$transaction(async (tx) => {
    // Close previous active membership
    await tx.userMembership.updateMany({
      where: { userId: id, status: "ACTIVE" },
      data: { status: "EXPIRED", endedAt: new Date() },
    });
    // Create new membership record
    await tx.userMembership.create({
      data: { userId: id, tier: membershipTier, status: "ACTIVE" },
    });
    return tx.user.update({ where: { id }, data: { membershipTier } });
  });
}

export async function updateUserStatus(id: string, isActive: boolean) {
  return prisma.user.update({ where: { id }, data: { isActive } });
}
