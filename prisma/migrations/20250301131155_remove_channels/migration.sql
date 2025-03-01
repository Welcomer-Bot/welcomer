/*
  Warnings:

  - You are about to drop the `Channels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channels" DROP CONSTRAINT "Channels_guildId_fkey";

-- DropTable
DROP TABLE "Channels";
