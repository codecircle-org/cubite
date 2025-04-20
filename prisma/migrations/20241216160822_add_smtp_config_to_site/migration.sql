-- AlterTable
ALTER TABLE `sites` ADD COLUMN `smtpDefaultFromEmail` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `smtpEmailHost` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `smtpEmailPassword` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `smtpEmailPort` INTEGER NULL DEFAULT 0,
    ADD COLUMN `smtpEmailUseSsl` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `smtpEmailUseTls` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `smtpEmailUsername` VARCHAR(191) NULL DEFAULT '';
