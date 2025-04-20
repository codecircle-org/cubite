-- DropForeignKey
ALTER TABLE `AchievementRecordsTemplate` DROP FOREIGN KEY `AchievementRecordsTemplate_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Certificate` DROP FOREIGN KEY `Certificate_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_courseId_fkey`;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AchievementRecordsTemplate` ADD CONSTRAINT `AchievementRecordsTemplate_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
