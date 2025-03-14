import {
    ImageCard,
    Leaver,
    Period, PrismaClient, Welcomer
} from "@prisma/client";
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


    public async deleteGuild(guildId: string) {
        return await this.guildStats.updateMany({
            where: {
                guildId,
            },
            data: {
                guildId: null,
            },
        });
    }

    public async getWelcomer(guildId: string): Promise<Welcomer | null> {
        return await this.welcomer.findFirst({
            where: {
                guildId,
            },
        });
    }

    public async getWelcomerCard(guildId: string): Promise<ImageCard | null> {
        const res = await this.welcomer.findFirst({
            where: {
                guildId: guildId,
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
        guildId: string
    ): Promise<CompleteEmbed[]> {
        return await this.embed.findMany({
            where: {
                [`${module}Id`]: guildId,
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
                guildId: {
                    not: null,
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