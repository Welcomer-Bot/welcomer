-- DropForeignKey
ALTER TABLE "Channels" DROP CONSTRAINT "Channels_guildId_fkey";

-- AddForeignKey
ALTER TABLE "Channels" ADD CONSTRAINT "Channels_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
