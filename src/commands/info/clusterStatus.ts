import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import WelcomerClient from "../../models/Client";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";

export default class ClusterStatusCommand implements CommandType {
  name = "clusterstatus";
  description = "Get the bot status";
  admin = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
    if (!client.isReady()) {
      return sendInteractionMessage(interaction, {
        content: "The client is not ready yet",
      });
    }

    console.log("Fetching cluster data");
    const res = await client.cluster.broadcastEval((c) => {
      return {
        clusterId: c.cluster.id,
        shardIds: [...c.cluster.ids.keys()],
        totalGuilds: c.guilds.cache.size,
        totalMembers: c.guilds.cache
          .map((g) => g.memberCount)
          .reduce((a, b) => a + b, 0),
        ping: c.ws.ping,
        uptime: c.uptime,
      };
    });
    console.log(res);

    return sendInteractionMessage(interaction, {
      embeds: [new EmbedBuilder().setTitle("Cluster Status")],
    });
  }
}
