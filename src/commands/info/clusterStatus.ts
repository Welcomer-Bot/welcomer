import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import WelcomerClient from "../../models/Client";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";

export default class ClusterStatusCommand implements CommandType {
  name = "clusterstatus";
  description = "Get the bot status";
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient
  ) {
    if (!client.isReady()) {
      return sendInteractionMessage(interaction, {
        content: "The client is not ready yet",
      });
    }

    const res = await client.cluster.broadcastEval((c) => {
      return {
        clusterId: c.cluster.id,
        shardIds: [...c.cluster.shardList],
        totalGuilds: c.guilds.cache.size,
        totalMembers: c.guilds.cache
          .map((g) => g.memberCount)
          .reduce((a, b) => a + b, 0),
        ping: c.ws.ping,
        uptime: Date.now() - c.uptime,
        memoryUsage: Number(
          Number(process.memoryUsage().rss / 1024 / 1024).toFixed(0)
        ),
        perShardcluster: [...c.cluster.shardList].map((shardId) => {
          return {
            shardId: shardId,
            status: c.ws.status,
            ping: c.ws.shards.get(shardId)?.ping,
            uptime: c.uptime,
            guilds: c.guilds.cache.filter((x) => x.shardId === shardId).size,
            members: c.guilds.cache
              .filter((x) => x.shardId === shardId)
              .map((g) => g.memberCount)
              .reduce((a, b) => a + b, 0),
          };
        }),
      };
    });

    const embeds = [];
    for (const cluster of res) {
      const embed = new EmbedBuilder()
        .setTitle(`:id: Cluster ${cluster.clusterId}`)
        .addFields(
          {
            name: ":id: Shard Ids",
            value: cluster.shardIds.join(", "),
            inline: true,
          },
          {
            name: ":bar_chart: Total Guilds",
            value: cluster.totalGuilds.toString(),
            inline: true,
          },
          {
            name: ":bar_chart: Total Members",
            value: cluster.totalMembers.toString(),
            inline: true,
          },
          {
            name: ":ping_pong: Ping",
            value: cluster.ping.toString(),
            inline: true,
          },
          {
            name: ":hourglass_flowing_sand: Uptime",
            value: `<t:${Math.round(cluster.uptime / 1000)}:R>`,

            inline: true,
          },
          {
            name: ":desktop: Memory Usage",
            value: cluster.memoryUsage.toString() + "MB",
            inline: true,
          },
          {
            name: ":arrows_counterclockwise: Guilds in this cluster",
            value: cluster.perShardcluster
              .reduce((a, b) => a + b.guilds, 0)
              .toString(),
            inline: true,
          }
        );
      for (const shard of cluster.perShardcluster) {
        embed.addFields({
          name: `:id: Shard ${shard.shardId}`,
          value: `:ping_pong: Ping: ${
            shard.ping
          }ms\n:hourglass_flowing_sand: Uptime: <t:${Math.round(
            (Date.now() - shard.uptime) / 1000
          )}:R>\n:chart_with_upwards_trend: Guilds: ${
            shard.guilds
          }\n:chart_with_upwards_trend: Members: ${shard.members}
            :desktop: Memory Usage: ${Number(
              process.memoryUsage().rss / 1024 / 1024
            ).toFixed(0)}MB
            :desktop: Status: ${shard.status.toString()}
              `,
          inline: false,
        });
      }
      embeds.push(embed);
    }
    //   split the embeds into chunks of 10
    const chunks = embeds.reduce((acc: EmbedBuilder[][], e, i) => {
      const index = Math.floor(i / 10);
      if (!acc[index]) acc[index] = [];
      acc[index].push(e);
      return acc;
    }, []);

    for (const chunk of chunks) {
      if (!chunk.length) return;
      await sendInteractionMessage(interaction, {
        embeds: chunk,
      });
    }
  }
}
