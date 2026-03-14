-- AlterTable: add new enum values to AuditAction
ALTER TABLE `audit_logs`
MODIFY COLUMN `action` ENUM(
    'USER_CREATED',
    'USER_UPDATED',
    'USER_DELETED',
    'LOGIN_SUCCEEDED',
    'LOGIN_FAILED',
    'LOGOUT_SUCCEEDED',
    'PASSWORD_RESET_REQUESTED',
    'PASSWORD_RESET_COMPLETED',
    'EMAIL_VERIFICATION_SENT',
    'EMAIL_VERIFIED',
    'MEMBERSHIP_TIER_UPDATED',
    'ROLE_UPDATED',
    'SESSION_REVOKED',
    'ACCOUNT_DISABLED',
    'ACCOUNT_ENABLED',
    'PASSWORD_CHANGED'
) NOT NULL;

-- AlterTable: add MembershipStatus enum to users (via user_memberships)
-- (AuditAction enum on audit_logs is already handled above)

-- CreateTable: user_sessions
CREATE TABLE `user_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(255) NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `lastActiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `user_sessions_sessionId_key` (`sessionId`),
    INDEX `user_sessions_userId_idx` (`userId`),
    INDEX `user_sessions_expiresAt_idx` (`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: user_memberships
CREATE TABLE `user_memberships` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tier` ENUM('BRONZE', 'SILVER', 'GOLD') NOT NULL,
    `status` ENUM(
        'ACTIVE',
        'EXPIRED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'ACTIVE',
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `user_memberships_userId_idx` (`userId`),
    INDEX `user_memberships_status_idx` (`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: permissions
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `permissions_name_key` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: role_permissions
CREATE TABLE `role_permissions` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL,
    `permissionName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `role_permissions_role_idx` (`role`),
    UNIQUE INDEX `role_permissions_role_permissionName_key` (`role`, `permissionName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: feature_entitlements
CREATE TABLE `feature_entitlements` (
    `id` VARCHAR(191) NOT NULL,
    `tier` ENUM('BRONZE', 'SILVER', 'GOLD') NOT NULL,
    `feature` VARCHAR(191) NOT NULL,
    `value` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `feature_entitlements_tier_idx` (`tier`),
    UNIQUE INDEX `feature_entitlements_tier_feature_key` (`tier`, `feature`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey: user_sessions.userId -> users.id
ALTER TABLE `user_sessions`
ADD CONSTRAINT `user_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: user_memberships.userId -> users.id
ALTER TABLE `user_memberships`
ADD CONSTRAINT `user_memberships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: role_permissions.permissionName -> permissions.name
ALTER TABLE `role_permissions`
ADD CONSTRAINT `role_permissions_permissionName_fkey` FOREIGN KEY (`permissionName`) REFERENCES `permissions` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;