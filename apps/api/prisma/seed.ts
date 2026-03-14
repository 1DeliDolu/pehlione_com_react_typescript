import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const prisma = new PrismaClient();

// Minimal argon2id-compatible hash using built-in crypto isn't possible,
// so we import argon2 directly here.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const argon2 = await import("argon2");

async function main() {
  console.log("🌱  Seeding database…");

  // ── 1. Admin user ─────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@pehlione.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin1234!";

  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      membershipTier: "GOLD",
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`✅  Admin user: ${admin.email} (id: ${admin.id})`);

  // ── 2. Permissions ────────────────────────────────────────────────────────
  const permissions = [
    { name: "users:read", description: "View user list" },
    { name: "users:write", description: "Create / update users" },
    { name: "users:delete", description: "Delete users" },
    { name: "audit:read", description: "View audit logs" },
    { name: "roles:write", description: "Change user roles" },
    { name: "memberships:write", description: "Change membership tiers" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm,
    });
  }

  console.log(`✅  ${permissions.length} permissions seeded`);

  // ── 3. Role → Permission mappings ─────────────────────────────────────────
  const adminPermissions = permissions.map((p) => p.name);

  for (const permName of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_permissionName: { role: "ADMIN", permissionName: permName },
      },
      update: {},
      create: { role: "ADMIN", permissionName: permName },
    });
  }

  console.log(`✅  Admin role permissions mapped`);

  // ── 4. Feature entitlements ───────────────────────────────────────────────
  const entitlements: Array<{
    tier: "BRONZE" | "SILVER" | "GOLD";
    feature: string;
    value: string;
  }> = [
    // BRONZE
    { tier: "BRONZE", feature: "api_calls_per_day", value: "100" },
    { tier: "BRONZE", feature: "max_projects", value: "1" },
    { tier: "BRONZE", feature: "support_level", value: "community" },
    // SILVER
    { tier: "SILVER", feature: "api_calls_per_day", value: "1000" },
    { tier: "SILVER", feature: "max_projects", value: "5" },
    { tier: "SILVER", feature: "support_level", value: "email" },
    { tier: "SILVER", feature: "analytics", value: "basic" },
    // GOLD
    { tier: "GOLD", feature: "api_calls_per_day", value: "unlimited" },
    { tier: "GOLD", feature: "max_projects", value: "unlimited" },
    { tier: "GOLD", feature: "support_level", value: "priority" },
    { tier: "GOLD", feature: "analytics", value: "advanced" },
    { tier: "GOLD", feature: "custom_domain", value: "true" },
  ];

  for (const e of entitlements) {
    await prisma.featureEntitlement.upsert({
      where: { tier_feature: { tier: e.tier, feature: e.feature } },
      update: { value: e.value },
      create: e,
    });
  }

  console.log(`✅  ${entitlements.length} feature entitlements seeded`);

  console.log("✅  Seeding complete");
}

main()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
