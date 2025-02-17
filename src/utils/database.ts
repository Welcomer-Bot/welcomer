import {
  Channels,
  Guild as GuildDb,
  ImageCard,
  Leaver,
  PrismaClient,
  Welcomer,
} from "@prisma/client";
import { Guild, GuildChannel, GuildChannelManager } from "discord.js";
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
  const res = await prisma.guild.upsert({
    where: {
      id: guild.id,
    },
    update: {},
    create: {
      id: guild.id,
    },
  });

  await createOrUpdateManyChannels(guild.channels);
  return res;
}

export async function createOrUpdateChannel(
  channel: GuildChannel
): Promise<Channels> {
  return await prisma.channels.upsert({
    where: {
      id: channel.id,
    },
    update: {
      name: channel.name,
      type: channel.type,
    },
    create: {
      id: channel.id,
      name: channel.name,
      guild: {
        connect: {
          id: channel.guild.id,
        },
      },
      type: channel.type,
    },
  });
}

export async function createOrUpdateManyChannels(channels: GuildChannelManager) {
  const channelData = channels.cache.map((channel) => ({
    id: channel.id,
    name: channel.name,
    guildId: channel.guild.id,
    type: channel.type,
  }));

  const upsertPromises = channelData.map((channel) =>
    prisma.channels.upsert({
      where: { id: channel.id },
      update: {
        name: channel.name,
        type: channel.type,
      },
      create: {
        id: channel.id,
        name: channel.name,
        guildId: channel.guildId,
        type: channel.type,
      },
    })
  );

  return await Promise.all(upsertPromises);
}


export async function createChannels(channels: GuildChannelManager) {
  return await prisma.channels.createMany({
    data: channels.cache.map((channel) => ({
      id: channel.id,
      name: channel.name,
      guild: {
        connect: {
          id: channel.guild.id,
        },
      },
      type: channel.type,
    })),
  });
}

export async function deleteChannel(channelId: string) {
  return await prisma.channels.delete({
    where: {
      id: channelId,
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
        },
      },
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
