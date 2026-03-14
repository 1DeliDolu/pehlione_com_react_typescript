import { prisma } from "../../lib/prisma.js";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}) {
  return prisma.user.create({ data });
}

export async function updateUser(
  id: string,
  data: Parameters<typeof prisma.user.update>[0]["data"],
) {
  return prisma.user.update({ where: { id }, data });
}

// Email verification token
export async function createEmailVerificationToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date,
) {
  return prisma.emailVerificationToken.create({
    data: { userId, tokenHash, expiresAt },
  });
}

export async function findEmailVerificationToken(tokenHash: string) {
  return prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
}

export async function markEmailVerificationTokenUsed(id: string) {
  return prisma.emailVerificationToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

// Password reset token
export async function createPasswordResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date,
) {
  // Invalidate prior tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
  return prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });
}

export async function findPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findUnique({ where: { tokenHash } });
}

export async function markPasswordResetTokenUsed(id: string) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}
