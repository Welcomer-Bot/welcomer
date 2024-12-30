import { CommandInteraction, EmbedBuilder } from "discord.js";

export const embedHelperOnGuildCreate = new EmbedBuilder()
  .setTitle(
    `:wave: Welcome to Welcomer - Your gateway to a warm and customized welcome!`
  )
  .setDescription(
    "Thank you for adding me to your server! I am a bot that helps you welcome new members to your server. To get started, click on the button below to configure me and enjoy the ease of welcoming new members!"
  )
  .setColor("#161f2f")
  .setImage("attachment://banner.png")
  .setFooter({ text: "Powered by Welcomer | Made with ❤️ by Clement" });

export const autoConfigEmbed = function () {
  return new EmbedBuilder().setTitle(
    `:wave: Welcome to Welcomer - Your gateway to a warm and customized welcome!`
  );
};

export function errorEmbedBuilder(
  message: string,
  stack?: string | undefined,
  interaction?: CommandInteraction
) {
  const embed = new EmbedBuilder()
    .setTitle(
      `Error
          \n ${message}`
    )
    .setDescription(`**${stack || "No description provided"}**`)
    .setColor("#ff0000")
    .setTimestamp();
  if (interaction) {
    embed.addFields(
      {
        name: "From",
        value: interaction.guild?.name || "Unknown Guild",
      },
      {
        name: "Triggered by",
        value: interaction.user.tag,
      },
      {
        name: "Command",
        value: interaction.commandName,
      }
    );
  }
}
