import {
  Guild as GuildDb,
  ImageCard,
  Leaver,
  PrismaClient,
  Welcomer,
} from "@prisma/client";
import { Guild } from "discord.js";
import { CompleteEmbed } from "../types";
const prisma = new PrismaClient();

export async function getGuild(guildId: string): Promise<GuildDb | null> {
  return await prisma.guild.findFirst({
    where: {
      id: guildId,
    },
  });
}

export async function createGuild(guild: Guild): Promise<GuildDb> {
  return await prisma.guild.create({
    data: {
      id: guild.id,
    },
  });
}

export async function createOrUpdateGuild(guild: Guild): Promise<GuildDb> {
  return await prisma.guild.upsert({
    where: {
      id: guild.id,
    },
    update: {},
    create: {
      id: guild.id,
    },
  });
}

export async function updateGuild(guild: Guild): Promise<GuildDb> {
  return await prisma.guild.update({
    where: {
      id: guild.id,
    },
    data: {
      ...guild,
    },
  });
}

export async function deleteGuild(guildId: string) {
  return await prisma.guild.delete({
    where: {
      id: guildId,
    },
  });
}

export async function getWelcomer(guildId: string): Promise<Welcomer | null> {
  return await prisma.welcomer.findFirst({
    where: {
      guildId,
    },
  });
}

export async function getWelcomerCard(
  moduleId: number
): Promise<ImageCard | null> {
  const res = await prisma.welcomer.findFirst({
    where: {
      id: moduleId,
    },
    
    include: {
      ImageCard_Welcomer_activeCardIdToImageCard: {
        include: {
          mainText: true,
          secondText: true,
          nicknameText: true,
        }
      }
    },
  });
  return res ? res.ImageCard_Welcomer_activeCardIdToImageCard : null;
}

export async function getEmbeds(
  module: "welcomer" | "leaver",
  moduleId: number
): Promise<CompleteEmbed[]> {
  return await prisma.embed.findMany({
    where: {
      [`${module}Id`]: moduleId,
    },
    include: {
      fields: true,
      author: true,
      footer: true,
      image: true,
    },
  });
}

export async function getLeaver(guildId: string): Promise<Leaver | null> {
  return prisma.leaver.findFirst({
    where: {
      guildId,
    },
  });
}
