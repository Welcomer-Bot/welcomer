import {
  ChatInputCommandInteraction,
  InteractionResponse,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import WelcomerClient from "../../models/Client";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";

export default class reloadCommands implements CommandType {
  name = "reloadcommands";
  description = "Reload all commands on all clusters";
  admin = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
    if (!client.admins.includes(interaction.user.id))
      return sendInteractionMessage(interaction, {
        content: "You are not allowed to use this command.",
        ephemeral: true,
      });
    await client.cluster
      .broadcastEval(async (c) => {
        await c.loadCommands();
      })
      .then(() => {
        sendInteractionMessage(interaction, {
          content: "Commands reloaded on all clusters!",
          ephemeral: true,
        });
      });
  }
}
