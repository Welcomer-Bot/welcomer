/*
  Warnings:

  - You are about to drop the column `activeImageId` on the `Leaver` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserGuild` table. All the data in the column will be lost.
  - You are about to drop the column `activeImageId` on the `Welcomer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activeCardId]` on the table `Leaver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeCardId]` on the table `Welcomer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserGuild" DROP CONSTRAINT "UserGuild_userId_fkey";

-- DropIndex
DROP INDEX "ImageCard_leaverId_key";

-- DropIndex
DROP INDEX "ImageCard_welcomerId_key";

-- AlterTable
ALTER TABLE "Leaver" DROP COLUMN "activeImageId",
ADD COLUMN     "activeCardId" INTEGER;

-- AlterTable
ALTER TABLE "UserGuild" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Welcomer" DROP COLUMN "activeImageId",
ADD COLUMN     "activeCardId" INTEGER;

-- CreateTable
CREATE TABLE "_UserToUserGuild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToUserGuild_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserToUserGuild_B_index" ON "_UserToUserGuild"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Leaver_activeCardId_key" ON "Leaver"("activeCardId");

-- CreateIndex
CREATE UNIQUE INDEX "Welcomer_activeCardId_key" ON "Welcomer"("activeCardId");

-- RenameForeignKey
ALTER TABLE "ImageCard" RENAME CONSTRAINT "ImageCard_activeLeaverCard_fkey" TO "ImageCard_leaverId_fkey";

-- RenameForeignKey
ALTER TABLE "ImageCard" RENAME CONSTRAINT "ImageCard_activeWelcomerCard_fkey" TO "ImageCard_welcomerId_fkey";

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_activeCardId_fkey" FOREIGN KEY ("activeCardId") REFERENCES "ImageCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_activeCardId_fkey" FOREIGN KEY ("activeCardId") REFERENCES "ImageCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserGuild" ADD CONSTRAINT "_UserToUserGuild_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserGuild" ADD CONSTRAINT "_UserToUserGuild_B_fkey" FOREIGN KEY ("B") REFERENCES "UserGuild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
