-- AlterTable
ALTER TABLE `Certificate` ADD COLUMN `certificateTemplateId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AchievementRecordsTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `permalink` VARCHAR(191) NULL,
    `courseName` VARCHAR(191) NULL,
    `content` JSON NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AchievementRecordsTemplate_permalink_key`(`permalink`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AchievementRecordsTemplate` ADD CONSTRAINT `AchievementRecordsTemplate_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
