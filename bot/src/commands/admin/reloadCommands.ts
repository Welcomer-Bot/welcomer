import {
  ChatInputCommandInteraction,
  InteractionResponse,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { loadCommands } from "../../structure/handlers";
import WelcomerClient from "../../structure/WelcomerClient";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";

export default class reloadCommands implements CommandType {
  name = "reloadcommands";
  description = "Reload all commands on all clusters";
  admin = true;
  noDefer?: boolean | undefined = true;
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addBooleanOption((option) =>
            option.setName("reloadrest").setDescription("Send new commands to rest").setRequired(false)
      );
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient,
    ...options: any
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
      if (!client.admins.includes(interaction.user.id))
      return sendInteractionMessage(interaction, {
        content: "You are not allowed to use this command.",
        ephemeral: true,
      });
    const reloadRest = interaction.options.getBoolean("reloadrest") || false;
    await client.cluster.broadcastEval(async (c) => {
      await c.loadCommands(reloadRest);
    });
  }
}
