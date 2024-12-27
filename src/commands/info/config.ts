import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";

export default class implements CommandType {
  name = "config";
  description = "Configure the bot";
  data = new SlashCommandBuilder()
    .setName("config")
    .setDescription(this.description);
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setTitle(`Currently in development`)
      .setDescription('This command is currently disabled, you can edit the config in the [dashboard](https://welcomer.app/dashboard)')
      .setColor(`#FF0000`)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
    // await createGuild(interaction.guild!)
    await sendInteractionMessage(interaction, { embeds: [embed] });
  }
}
