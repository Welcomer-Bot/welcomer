import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";
import { formatNumber } from "./../../utils/functions";

function formatState(state: Number) {
  switch (state) {
    case 0:
      return "Ready";
    case 1:
      return "Connecting";
    case 2:
      return "Reconnecting";
    case 3:
      return "Idle";
    case 4:
      return "Nearly";
    case 5:
      return "Disconnected";
    case 6:
      return "Waiting for Guilds";
    case 7:
      return "Identifying";
    case 8:
      return "Resuming";

    default:
      return "Unknown";
  }
}

export default class StatusCommand implements CommandType {
  name = "status";
  description = "Get the bot status";
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient,
    ...options: any
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
    if (!client.isReady()) {
      return sendInteractionMessage(interaction, {
        content: "The client is not ready yet",
      });
    }

    let ram;
    let membersize;
    let guildsize;

    const promises = [
      client.cluster.broadcastEval("this.guilds.cache.size"),
      client.cluster.broadcastEval(
        "this.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount||0), 0)"
      ),
      client.cluster.broadcastEval(
        "Number(Number(process.memoryUsage().rss/1024/1024).toFixed(0))"
      ),
    ];

    await Promise.all(promises).then((results) => {
      guildsize = results[0].reduce(
        (acc, guildCount) => Number(acc + guildCount),
        0
      );
      membersize = results[1].reduce(
        (acc, memberCount) => Number(acc + memberCount),
        0
      );
      ram = Number(
        results[2].reduce((acc, totalram) => Number(acc + totalram), 0)
      );
    });

    let statusEmbed = new EmbedBuilder()
      .setTitle(`${client.user?.username} status:`)
      .addFields(
        {
          name: ":green_circle: State",
          value: formatState(client.ws.status),
          inline: true,
        },
        {
          name: ":ping_pong: Discord API Ping",
          value: `${client.ws.ping}ms`,
          inline: true,
        },
        {
          name: ":hourglass_flowing_sand: Uptime",
          value: `<t:${Math.round(
            client.readyTimestamp / 1000
          )}:R> (${Math.floor(interaction.client.uptime / 1000 / 60)} minutes)`,
          inline: true,
        },
        {
          name: ":id: Cluster ID",
          value: `${client.cluster.id}`,
          inline: true,
        },
        {
          name: ":id: Shard ID",
          value: `${interaction.guild?.shardId}`,
          inline: true,
        },
        {
          name: ":id: Guilds",
          value: `${formatNumber(guildsize || 0)}`,
          inline: true,
        },
        {
          name: ":id: Members",
          value: `${formatNumber(membersize || 0)}`,
          inline: true,
        },
        {
          name: ":id: RAM",
          value: `${ram}MB`,
          inline: true,
        }
      )
      .setColor("#0099ff")
      .setTimestamp();
    await sendInteractionMessage(interaction, { embeds: [statusEmbed] });
  }
}
