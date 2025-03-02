/*
  Warnings:

  - You are about to drop the `BotGuild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BotGuild" DROP CONSTRAINT "BotGuild_id_fkey";

-- DropTable
DROP TABLE "BotGuild";

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_id_fkey" FOREIGN KEY ("id") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
