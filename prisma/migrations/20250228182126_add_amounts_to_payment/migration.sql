-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `amountDiscounted` INTEGER NULL,
    ADD COLUMN `amountShipping` INTEGER NULL,
    ADD COLUMN `amountSubtotal` INTEGER NULL,
    ADD COLUMN `amountTax` INTEGER NULL;
