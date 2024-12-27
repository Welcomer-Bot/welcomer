import {
  ChatInputCommandInteraction,
  InteractionResponse,
  Message,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
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
    interaction: ChatInputCommandInteraction
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
    if (!interaction.guild) return;
    await sendInteractionMessage(interaction, {
      content: "Trying to fix the bot, please wait...",
    });
    await createOrUpdateGuild(interaction.guild);
    await sendInteractionMessage(interaction, {
      content: "Bot fixed successfully.",
    });
  }
}
