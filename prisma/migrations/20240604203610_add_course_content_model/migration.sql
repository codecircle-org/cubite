-- CreateTable
CREATE TABLE `CourseContent` (
    `id` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `version` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,

    INDEX `CourseContent_authorId_idx`(`authorId`),
    UNIQUE INDEX `CourseContent_courseId_version_key`(`courseId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseContent` ADD CONSTRAINT `CourseContent_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseContent` ADD CONSTRAINT `CourseContent_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
