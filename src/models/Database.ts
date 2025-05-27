import { Period, PrismaClient, Source, SourceType } from "@prisma/client";
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

  public async getSource(
    guildId: string,
    source: SourceType
  ): Promise<Source | null> {
    return await this.source.findFirst({
      where: {
        guildId,
        type: source,
      },
    });
  }

  public async getSourceCard(guildId: string, source: SourceType) {
    const res = await this.imageCard.findFirst({
      where: {
        Source_Source_activeCardIdToImageCard: {
          guildId: guildId,
          type: source,
        },
      },
      include: {
        mainText: true,
        secondText: true,
        nicknameText: true,
      },
    });
    return res;
  }

  public async getEmbeds(
    source: SourceType,
    guildId: string
  ): Promise<CompleteEmbed[]> {
    return await this.embed.findMany({
      where: {
        Source_Embed_SourceidToSource: {
          guildId: guildId,
          type: source,
        },
      },
      include: {
        fields: true,
        author: true,
        footer: true,
        image: true,
      },
    });
  }

  public async getLatestGuildStatsOfAllPeriods(
    guildId: string,
    source: SourceType
  ) {
    //TODO: review the getting of the latest guild stats
    const getPromises = (Object.keys(Period) as Array<keyof typeof Period>).map(
      async (period) => {
        return await this.guildStats.findFirst({
          where: {
            guildId,
            source,
            period,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    );
    return await Promise.all(getPromises);
  }

  public async addMemberWelcomed(guildId: string) {
    const toUpdate = await this.getLatestGuildStatsOfAllPeriods(
      guildId,
      "Welcomer"
    );
    toUpdate.forEach(async (stats) => {
      if (stats) {
        await this.guildStats.updateMany({
          where: {
            guildId: stats.guildId,
            period: stats.period,
            source: stats.source,
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
    source: SourceType,
    nbImages: number = 1
  ) {
    const toUpdate = await this.getLatestGuildStatsOfAllPeriods(
      guildId,
      source
    );
    toUpdate.forEach(async (stats) => {
      if (stats) {
        await this.guildStats.updateMany({
          where: {
            guildId: stats.guildId,
            period: stats.period,
            source: stats.source,
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
    source: SourceType,
    nbMessages: number = 1
  ) {
    const toUpdate = await this.getLatestGuildStatsOfAllPeriods(
      guildId,
      source
    );
    toUpdate.forEach(async (stats) => {
      if (stats) {
        await this.guildStats.updateMany({
          where: {
            guildId: stats.guildId,
            period: stats.period,
            source: stats.source,
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
    source: SourceType,
    nbEmbeds: number = 1
  ) {
    const toUpdate = await this.getLatestGuildStatsOfAllPeriods(
      guildId,
      source
    );
    toUpdate.forEach(async (stats) => {
      if (stats) {
        await this.guildStats.updateMany({
          where: {
            guildId: stats.guildId,
            period: stats.period,
            source: stats.source,
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

  private async getStats(source: SourceType, period: Period) {
    return await this.guildStats.groupBy({
      by: ["guildId", "source", "period"],
      where: {
        source: source,
        period: period,
        guildId: {
          not: null,
        },
      },
    });
  }

  public async createStats(period: Period) {
    for (const source of Object.values(SourceType)) {
      const currentStats = await this.getStats(
        source,
        period
      );
      for (const currentStat of currentStats) {
        // console.log(currentStat);
        await this.guildStats.create({
          data: {
            guildId: currentStat.guildId,
            source: currentStat.source,
            period: currentStat.period,
          },
        });
      }
    }
  }
}
