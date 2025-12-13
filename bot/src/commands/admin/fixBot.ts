import {
  ChatInputCommandInteraction,
  InteractionResponse,
  Message,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { CommandType } from "../../types";
import { createOrUpdateGuild } from "../../utils/createGuild";
import { sendInteractionMessage } from "../../utils/messages";

export default class fixBot implements CommandType {
  name = "fixbot";
  ephemeral?: boolean | undefined = true;
  description = "Try to fix errors in the bot.";
  data = new SlashCommandBuilder()
    .setName("leaveguild")
    .setDescription(this.description)
    .setDefaultMemberPermissions(
      PermissionsBitField.Flags.Administrator ||
        PermissionsBitField.Flags.ManageGuild
    );
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
    if (!interaction.guild) return;

    try {
      await sendInteractionMessage(interaction, {
        content: "Trying to fix the bot, please wait...",
      });

      await createOrUpdateGuild(interaction.guild);

      await sendInteractionMessage(interaction, {
        content: "Bot fixed successfully.",
      });
    } catch (err) {
      console.error("Error in fixBot command:", err);
      await sendInteractionMessage(interaction, {
        content: "Failed to fix the bot. Please try again later.",
      }).catch(console.error);
    }
  }
}
