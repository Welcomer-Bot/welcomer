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
  .setFooter({ text: "-# Powered by Welcomer" });

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


export const betaInfoEmbedBuilder = new EmbedBuilder()
  .setTitle("Beta Access Required")
  .setDescription(
    `You have added the **Beta Bot**, but you are not currently enrolled in the **Beta Program**.

**How to gain access:**
- Join our [support server](https://discord.gg/7TGc5ZZ7aM).
- Open a ticket to request beta access.

If you intended to add the stable version, you can invite the bot from **[this link](https://welcomer.app/invite)**.
`
  )
  .setColor("#ff0000")
  .setFooter({ text: "Thank you for your interest in our beta program!" })
  .setImage("attachment://banner.png")
  .setTimestamp();

