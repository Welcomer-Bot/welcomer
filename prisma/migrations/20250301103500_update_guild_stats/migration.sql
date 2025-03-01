-- CreateEnum
CREATE TYPE "Module" AS ENUM ('welcomer', 'leaver');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'TOTAL');

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "premium" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Welcomer" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT,
    "channelId" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "activeCardId" INTEGER,
    "activeCardToEmbedId" INTEGER,

    CONSTRAINT "Welcomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaver" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT,
    "channelId" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "activeCardToEmbedId" INTEGER,
    "activeCardId" INTEGER,

    CONSTRAINT "Leaver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DM" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embed" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(256),
    "description" VARCHAR(4096),
    "timestamp" TIMESTAMP(3),
    "timestampNow" BOOLEAN,
    "thumbnail" TEXT,
    "url" TEXT,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "welcomerId" INTEGER,
    "leaverId" INTEGER,
    "DMId" INTEGER,
    "color" TEXT,

    CONSTRAINT "Embed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedImage" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "heigth" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EmbedImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedAuthor" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "url" VARCHAR(256),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EmbedAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedField" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "inline" BOOLEAN,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EmbedField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedFooter" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER,
    "text" VARCHAR(2048) NOT NULL,
    "iconUrl" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EmbedFooter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCard" (
    "id" SERIAL NOT NULL,
    "backgroundImgURL" TEXT,
    "backgroundColor" TEXT,
    "avatarBorderColor" TEXT,
    "colorTextDefault" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "welcomerId" INTEGER,
    "leaverId" INTEGER,
    "mainTextId" INTEGER,
    "secondTextId" INTEGER,
    "nicknameTextId" INTEGER,

    CONSTRAINT "ImageCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCardText" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "color" TEXT,
    "font" TEXT,
    "size" INTEGER,
    "weight" TEXT,

    CONSTRAINT "ImageCardText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "discriminator" TEXT,
    "avatar" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGuild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "banner" TEXT,
    "permissions" TEXT,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserGuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" INTEGER NOT NULL,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildStats" (
    "id" SERIAL NOT NULL,
    "period" "Period" NOT NULL,
    "module" "Module" NOT NULL,
    "generatedImages" INTEGER NOT NULL DEFAULT 0,
    "generatedEmbeds" INTEGER NOT NULL DEFAULT 0,
    "generatedMessages" INTEGER NOT NULL DEFAULT 0,
    "membersEvent" INTEGER NOT NULL DEFAULT 0,
    "guildId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuildStats_pkey" PRIMARY KEY ("id","period","module","createdAt")
);

-- CreateTable
CREATE TABLE "betaGuild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "betaGuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserGuild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToUserGuild_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Welcomer_guildId_key" ON "Welcomer"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Welcomer_activeCardId_key" ON "Welcomer"("activeCardId");

-- CreateIndex
CREATE UNIQUE INDEX "Welcomer_activeCardToEmbedId_key" ON "Welcomer"("activeCardToEmbedId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaver_guildId_key" ON "Leaver"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaver_activeCardToEmbedId_key" ON "Leaver"("activeCardToEmbedId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaver_activeCardId_key" ON "Leaver"("activeCardId");

-- CreateIndex
CREATE UNIQUE INDEX "DM_moduleId_key" ON "DM"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Embed_DMId_key" ON "Embed"("DMId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedImage_embedId_key" ON "EmbedImage"("embedId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedAuthor_embedId_key" ON "EmbedAuthor"("embedId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedFooter_embedId_key" ON "EmbedFooter"("embedId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCard_mainTextId_key" ON "ImageCard"("mainTextId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCard_secondTextId_key" ON "ImageCard"("secondTextId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCard_nicknameTextId_key" ON "ImageCard"("nicknameTextId");

-- CreateIndex
CREATE INDEX "_UserToUserGuild_B_index" ON "_UserToUserGuild"("B");

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_activeCardId_fkey" FOREIGN KEY ("activeCardId") REFERENCES "ImageCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_activeCardToEmbedId_fkey" FOREIGN KEY ("activeCardToEmbedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_activeCardId_fkey" FOREIGN KEY ("activeCardId") REFERENCES "ImageCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_activeCardToEmbedId_fkey" FOREIGN KEY ("activeCardToEmbedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Welcomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_DMId_fkey" FOREIGN KEY ("DMId") REFERENCES "DM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_leaverId_fkey" FOREIGN KEY ("leaverId") REFERENCES "Leaver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_welcomerId_fkey" FOREIGN KEY ("welcomerId") REFERENCES "Welcomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedImage" ADD CONSTRAINT "EmbedImage_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedAuthor" ADD CONSTRAINT "EmbedAuthor_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedField" ADD CONSTRAINT "EmbedField_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedFooter" ADD CONSTRAINT "EmbedFooter_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_leaverId_fkey" FOREIGN KEY ("leaverId") REFERENCES "Leaver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_mainTextId_fkey" FOREIGN KEY ("mainTextId") REFERENCES "ImageCardText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_nicknameTextId_fkey" FOREIGN KEY ("nicknameTextId") REFERENCES "ImageCardText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_secondTextId_fkey" FOREIGN KEY ("secondTextId") REFERENCES "ImageCardText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_welcomerId_fkey" FOREIGN KEY ("welcomerId") REFERENCES "Welcomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channels" ADD CONSTRAINT "Channels_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "UserGuild"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildStats" ADD CONSTRAINT "GuildStats_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "betaGuild" ADD CONSTRAINT "betaGuild_id_fkey" FOREIGN KEY ("id") REFERENCES "UserGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserGuild" ADD CONSTRAINT "_UserToUserGuild_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserGuild" ADD CONSTRAINT "_UserToUserGuild_B_fkey" FOREIGN KEY ("B") REFERENCES "UserGuild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
