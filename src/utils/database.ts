import { PrismaClient } from "@prisma/client";
import { Guild } from "discord.js";
const prisma = new PrismaClient();

export function getGuild(guildId: string) {
    return prisma.guild.findFirst({
        where: {
        id: guildId,
        },
    });
}

export function createGuild(guild: Guild) {
    return prisma.guild.create({
        data: {
        id: guild.id,
        },
    });
}

export function updateGuild(guild: Guild) {
    return prisma.guild.update({
        where: {
        id: guild.id,
        },
        data: {
        ...guild,
        },
    });
}

export function deleteGuild(guildId: string) {
    return prisma.guild.delete({
        where: {
        id: guildId,
        },
    });
}

export function getWelcomer(guildId: string) {
    return prisma.welcomer.findFirst({
        where: {
        guildId,
        },
    });
}

export function getLeaver(guildId: string) {
    return prisma.leaver.findFirst({
        where: {
        guildId,
        },
    });
}