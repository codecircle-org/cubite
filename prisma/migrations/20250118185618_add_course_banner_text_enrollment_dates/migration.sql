-- AlterTable
ALTER TABLE `Course` ADD COLUMN `banner` TEXT NULL,
    ADD COLUMN `enrollmentEndDate` DATETIME(3) NULL,
    ADD COLUMN `enrollmentStartDate` DATETIME(3) NULL;
