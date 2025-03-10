import {
    Channels,
    Guild as GuildDb,
    ImageCard,
    Leaver,
    Period, PrismaClient, Welcomer
} from "@prisma/client";
import { Guild, GuildChannel, GuildChannelManager } from "discord.js";
import { CompleteEmbed } from "../types";
import Logger from "./Logger";

export default class Database extends PrismaClient {
    public logger: Logger;

    constructor(logger: Logger) {
        super();
        this.logger = logger;
        this.connect();
    }

    async connect() {
        await this.$connect();
        console.log("Connected to the database");
    }

    public async getGuild(guildId: string): Promise<GuildDb | null> {
        return await this.guild.findFirst({
            where: {
                id: guildId,
            },
        });
    }

    public async createGuild(guild: Guild): Promise<GuildDb> {
        return await this.guild.create({
            data: {
                id: guild.id,
                name: guild.name,
                description: guild.description,
                icon: guild.icon,
                banner: guild.banner,
                memberCount: guild.memberCount,
                BotGuild: {
                    connectOrCreate: {
                        where: {
                            id: guild.id,
                        },
                        create: {},
                    },
                },
            },
        });
    }

    public async createOrUpdateGuild(guild: Guild): Promise<GuildDb> {
        const res = await this.guild.upsert({
            where: {
                id: guild.id,
            },
            update: {
                name: guild.name,
                description: guild.description,
                icon: guild.icon,
                banner: guild.banner,
                memberCount: guild.memberCount,
                BotGuild: {
                    connectOrCreate: {
                        where: {
                            id: guild.id,
                        },
                        create: {},
                    },
                },
            },
            create: {
                id: guild.id,
                name: guild.name,
                description: guild.description,
                icon: guild.icon,
                banner: guild.banner,
                memberCount: guild.memberCount,
                BotGuild: {
                    connectOrCreate: {
                        where: {
                            id: guild.id,
                        },
                        create: {},
                    },
                },
            },
        });

        await this.createOrUpdateManyChannels(guild.channels);
        return res;
    }

    public async createOrUpdateChannel(channel: GuildChannel): Promise<Channels> {
        return await this.channels.upsert({
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
                guildId: channel.guild.id,
                type: channel.type,
            },
        });
    }

    public async createOrUpdateManyChannels(channels: GuildChannelManager) {
        const channelData = channels.cache.map((channel) => ({
            id: channel.id,
            name: channel.name,
            guildId: channel.guild.id,
            type: channel.type,
        }));
        const upsertPromises = channelData.map((channel) =>
            this.channels.upsert({
                where: { id: channel.id },
                update: {
                    name: channel.name,
                    type: channel.type,
                },
                create: {
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    Guild: {
                        connect: {
                            id: channel.guildId,
                        },
                    },
                },
            })
        );

        return await Promise.all(upsertPromises);
    }

    public async createChannels(channels: GuildChannelManager) {
        return await this.channels.createMany({
            data: channels.cache.map((channel) => ({
                id: channel.id,
                name: channel.name,
                guildId: channel.guild.id,
                type: channel.type,
            })),
        });
    }

    public async deleteChannel(channelId: string) {
        return await this.channels.delete({
            where: {
                id: channelId,
            },
        });
    }

    public async updateGuild(guild: Guild): Promise<GuildDb> {
        return await this.guild.update({
            where: {
                id: guild.id,
            },
            data: {
                id: guild.id,
                name: guild.name,
                description: guild.description,
                icon: guild.icon,
                banner: guild.banner,
                memberCount: guild.memberCount,
            },
        });
    }

    public async deleteGuild(guildId: string) {
        const deleteGuild = this.botGuild.deleteMany({
            where: {
                id: guildId,
            },
        });
        const disconnectStats = this.guildStats.updateMany({
            where: {
                guildId,
            },
            data: {
                guildId: null,
            },
        });
        return await this.$transaction([deleteGuild, disconnectStats]);
    }

    public async getWelcomer(guildId: string): Promise<Welcomer | null> {
        return await this.welcomer.findFirst({
            where: {
                guildId,
            },
        });
    }

    public async getWelcomerCard(moduleId: number): Promise<ImageCard | null> {
        const res = await this.welcomer.findFirst({
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

    public async getEmbeds(
        module: "welcomer" | "leaver",
        moduleId: number
    ): Promise<CompleteEmbed[]> {
        return await this.embed.findMany({
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

    public async getLeaver(guildId: string): Promise<Leaver | null> {
        return await this.leaver.findFirst({
            where: {
                guildId,
            },
        });
    }

    public async getLatestGuildStatsOfAllPeriods(
        guildId: string,
        module: "welcomer" | "leaver"
    ) {
        const getPromises = (Object.keys(Period) as Array<keyof typeof Period>).map(async (period) => {
            return await this.guildStats.findFirst({
                where: {
                    guildId,
                    module,
                    period,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        });
        return await Promise.all(getPromises);
    }

    public async addMemberWelcomed(guildId: string) {
        const toUpdate = await this.getLatestGuildStatsOfAllPeriods(guildId, "welcomer");
        toUpdate.forEach(async (stats) => {
            if (stats) {
                await this.guildStats.updateMany({
                    where: {
                        guildId: stats.guildId,
                        period: stats.period,
                        module: stats.module,
                        createdAt: stats.createdAt,
                    },
                    data: {
                        membersEvent: {
                            increment: 1,
                        },
                    },
                });
            }
        });
    }

    public async updateGuildStatsGeneratedImages(
        guildId: string,
        module: "welcomer" | "leaver",
        nbImages: number = 1
    ) {
        const toUpdate = await this.getLatestGuildStatsOfAllPeriods(guildId, module);
        toUpdate.forEach(async (stats) => {
            if (stats) {
                await this.guildStats.updateMany({
                    where: {
                        guildId: stats.guildId,
                        period: stats.period,
                        module: stats.module,
                        createdAt: stats.createdAt,
                    },
                    data: {
                        generatedImages: {
                            increment: nbImages,
                        },
                    },
                });
            }
        });
    }

    public async updateGuildStatsGeneratedMessages(
        guildId: string,
        module: "welcomer" | "leaver",
        nbMessages: number = 1
    ) {
        const toUpdate = await this.getLatestGuildStatsOfAllPeriods(guildId, module);
        toUpdate.forEach(async (stats) => {
            if (stats) {
                await this.guildStats.updateMany({
                    where: {
                        guildId: stats.guildId,
                        period: stats.period,
                        module: stats.module,
                        createdAt: stats.createdAt,
                    },
                    data: {
                        generatedMessages: {
                            increment: nbMessages,
                        },
                    },
                });
            }
        });
    }

    public async updateGuildStatsGeneratedEmbeds(
        guildId: string,
        module: "welcomer" | "leaver",
        nbEmbeds: number = 1
    ) {
        const toUpdate = await this.getLatestGuildStatsOfAllPeriods(guildId, module);
        toUpdate.forEach(async (stats) => {
            if (stats) {
                await this.guildStats.updateMany({
                    where: {
                        guildId: stats.guildId,
                        period: stats.period,
                        module: stats.module,
                        createdAt: stats.createdAt,
                    },
                    data: {
                        generatedEmbeds: {
                            increment: nbEmbeds,
                        },
                    },
                });
            }
        });
    }

    public async isGuildInBeta(guildId: string): Promise<boolean> {
        const guild = await this.betaGuild.findUnique({
            where: {
                id: guildId,
            },
        });
        return !!guild;
    }

    private async getStats(module: "welcomer" | "leaver", period: Period) {
        return await this.guildStats.groupBy({
            by: ["guildId", "module", "period"],
            where: {
                module: module,
                period: period,
                guild: {
                    NOT: undefined,
                },
            },
        });
    }

    public async createStats(period: Period) {
        for (const module of ["welcomer", "leaver"]) {
            const currentStats = await this.getStats(module as "welcomer" | "leaver", period);
            for (const currentStat of currentStats) {
                console.log(currentStat);
                await this.guildStats.create({
                    data: {
                        guildId: currentStat.guildId,
                        module: currentStat.module,
                        period: currentStat.period,
                    },
                });
            }
        }
    }
}