-- AlterTable
ALTER TABLE `sites` ADD COLUMN `loginFormVisible` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `registrationFormVisible` BOOLEAN NULL DEFAULT true;
