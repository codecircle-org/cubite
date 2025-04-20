-- AlterTable
ALTER TABLE `sites` ADD COLUMN `stripePublishableKey` TEXT NULL,
    ADD COLUMN `stripeSecretKey` TEXT NULL,
    ADD COLUMN `stripeWebhookSecret` TEXT NULL;
