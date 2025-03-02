-- CreateTable
CREATE TABLE "_BotGuildToGuild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BotGuildToGuild_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BotGuildToGuild_B_index" ON "_BotGuildToGuild"("B");

-- AddForeignKey
ALTER TABLE "_BotGuildToGuild" ADD CONSTRAINT "_BotGuildToGuild_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BotGuildToGuild" ADD CONSTRAINT "_BotGuildToGuild_B_fkey" FOREIGN KEY ("B") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
