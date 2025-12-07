import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { CommandType } from "../../types";
import { dashButton } from "../../utils/buttons";
import { sendInteractionMessage } from "../../utils/messages";

export default class implements CommandType {
  name = "config";
  description = "Configure the bot";
  data = new SlashCommandBuilder()
    .setName("config")
    .setDescription(this.description);
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    let embed = new EmbedBuilder()
      .setTitle(`Configure Welcomer with its dashboard !`)
      .setURL(`https://welcomer.app/dashboard`)
      .setDescription(
        `# How to edit the bot's configuration ?
1. Go to the [dashboard](https://welcomer.app/dashboard) ( click on this link or in the button below )
2. Select your server
3. Edit the configuration
4. Save the configuration
5. Done !
        `
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
    // await createGuild(interaction.guild!)
    await sendInteractionMessage(interaction, {
      embeds: [embed],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(dashButton),
      ],
    });
  }
}
