-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_id_fkey";

-- CreateTable
CREATE TABLE "BotGuild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BotGuild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotGuild" ADD CONSTRAINT "BotGuild_id_fkey" FOREIGN KEY ("id") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
