/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostAuthor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostSubjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToSite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostTopics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PostAuthor` DROP FOREIGN KEY `PostAuthor_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostAuthor` DROP FOREIGN KEY `PostAuthor_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PostContent` DROP FOREIGN KEY `PostContent_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `PostContent` DROP FOREIGN KEY `PostContent_postId_fkey`;

-- DropForeignKey
ALTER TABLE `_PostSubjects` DROP FOREIGN KEY `_PostSubjects_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PostSubjects` DROP FOREIGN KEY `_PostSubjects_B_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToSite` DROP FOREIGN KEY `_PostToSite_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToSite` DROP FOREIGN KEY `_PostToSite_B_fkey`;

-- DropForeignKey
ALTER TABLE `_PostTopics` DROP FOREIGN KEY `_PostTopics_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PostTopics` DROP FOREIGN KEY `_PostTopics_B_fkey`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `PostAuthor`;

-- DropTable
DROP TABLE `PostContent`;

-- DropTable
DROP TABLE `_PostSubjects`;

-- DropTable
DROP TABLE `_PostToSite`;

-- DropTable
DROP TABLE `_PostTopics`;

-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `permalink` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `blurb` VARCHAR(191) NULL,

    UNIQUE INDEX `Page_permalink_key`(`permalink`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageContent` (
    `id` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `version` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pageId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,

    INDEX `PageContent_authorId_idx`(`authorId`),
    INDEX `PageContent_pageId_idx`(`pageId`),
    UNIQUE INDEX `PageContent_pageId_version_key`(`pageId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageAuthor` (
    `pageId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `PageAuthor_userId_idx`(`userId`),
    PRIMARY KEY (`pageId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PageSubjects` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PageSubjects_AB_unique`(`A`, `B`),
    INDEX `_PageSubjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PageTopics` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PageTopics_AB_unique`(`A`, `B`),
    INDEX `_PageTopics_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PageToSite` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PageToSite_AB_unique`(`A`, `B`),
    INDEX `_PageToSite_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PageContent` ADD CONSTRAINT `PageContent_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageContent` ADD CONSTRAINT `PageContent_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageAuthor` ADD CONSTRAINT `PageAuthor_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageAuthor` ADD CONSTRAINT `PageAuthor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PageSubjects` ADD CONSTRAINT `_PageSubjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PageSubjects` ADD CONSTRAINT `_PageSubjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PageTopics` ADD CONSTRAINT `_PageTopics_A_fkey` FOREIGN KEY (`A`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PageTopics` ADD CONSTRAINT `_PageTopics_B_fkey` FOREIGN KEY (`B`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PageToSite` ADD CONSTRAINT `_PageToSite_A_fkey` FOREIGN KEY (`A`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PageToSite` ADD CONSTRAINT `_PageToSite_B_fkey` FOREIGN KEY (`B`) REFERENCES `sites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
