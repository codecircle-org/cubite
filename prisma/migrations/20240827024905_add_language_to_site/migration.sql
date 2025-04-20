-- CreateTable
CREATE TABLE `Language` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Language_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SiteLanguages` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SiteLanguages_AB_unique`(`A`, `B`),
    INDEX `_SiteLanguages_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SiteLanguages` ADD CONSTRAINT `_SiteLanguages_A_fkey` FOREIGN KEY (`A`) REFERENCES `Language`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SiteLanguages` ADD CONSTRAINT `_SiteLanguages_B_fkey` FOREIGN KEY (`B`) REFERENCES `sites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
