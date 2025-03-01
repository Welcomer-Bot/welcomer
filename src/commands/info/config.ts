import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { dashButton } from "../../utils/buttons";

export default class implements CommandType {
  name = "config";
  description = "Configure the bot";
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setTitle(`Configuration`)
      .setDescription('To edit the configuration, go to [beta.welcomer.app](https://beta.welcomer.app)')
      .setColor(`#FF0000`)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
    // await createGuild(interaction.guild!)
    await sendInteractionMessage(interaction, {
      embeds: [embed], components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(dashButton)
    ] });
  }
}
