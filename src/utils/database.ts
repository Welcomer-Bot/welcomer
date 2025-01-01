import { PrismaClient, Welcomer, Leaver, Guild as GuildDb } from "@prisma/client";
import { Guild } from "discord.js";
import { CompleteEmbed } from "prisma/schema";
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

export async function getEmbeds(module: string, moduleId: number): Promise<CompleteEmbed[]> {
    return await prisma.embed.findMany({
        where: {
        [`${module}Id`]: moduleId,
        },
        include: {
            fields: true,
            author: true,
            footer: true,
            image: {
                include: {
                    embed: true,
                },
            },
        }
    });
}

export async function getLeaver(guildId: string): Promise<Leaver | null> {
    return prisma.leaver.findFirst({
        where: {
        guildId,
        },
    });
}