-- AlterTable
ALTER TABLE `sites` ADD COLUMN `openedxLtiConsumerKey` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `openedxLtiConsumerSecret` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `openedxOauthClientId` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `openedxOauthClientSecret` VARCHAR(191) NULL DEFAULT '';
