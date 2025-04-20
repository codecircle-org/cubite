-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_courseId_fkey`;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
