/*
  Warnings:

  - You are about to drop the `_BotGuildToGuild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BotGuildToGuild" DROP CONSTRAINT "_BotGuildToGuild_A_fkey";

-- DropForeignKey
ALTER TABLE "_BotGuildToGuild" DROP CONSTRAINT "_BotGuildToGuild_B_fkey";

-- DropTable
DROP TABLE "_BotGuildToGuild";

-- CreateTable
CREATE TABLE "BotGuild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BotGuild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotGuild" ADD CONSTRAINT "BotGuild_id_fkey" FOREIGN KEY ("id") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
