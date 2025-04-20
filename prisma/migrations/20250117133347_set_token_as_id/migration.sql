/*
  Warnings:

  - The primary key for the `PasswordResetToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PasswordResetToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `PasswordResetToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PasswordResetToken` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`token`);

-- CreateIndex
CREATE UNIQUE INDEX `PasswordResetToken_token_key` ON `PasswordResetToken`(`token`);
