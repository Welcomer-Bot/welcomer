import { APIEmbed, CommandInteraction, Embed } from "discord.js";

const {
  EmbedBuilder,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  WebhookClient,
} = require("discord.js");

/**
 * @param {Client} client
 */

const log_hook = new WebhookClient({ url: process.env.LOGS_WEBHOOK });
const addRemoveHook = new WebhookClient({
  url: process.env.ADD_REMOVE_WEBHOOK,
});
const statusHook = new WebhookClient({ url: process.env.STATUS_WEBHOOK });

export const error = (message: Error, interaction?: CommandInteraction): void => {
  try {
    const embed = new EmbedBuilder()
      .setTitle(
        `Error
        \n ${message.message || message}`
      )
      .setDescription(`**${message.stack || "No description provided"}**`)
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

    const errorButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/7TGc5ZZ7aM")
    );

    let userEmbed = new EmbedBuilder()
      .setTitle("An error has occured")
      .setDescription(
        `Error has been automaticly reported to the developers. Please consider reporting the error if it persists.
              \n**${message}**`
      )
      .setColor("#ff0000")
      .setTimestamp();

    log_hook.send({
      embeds: [embed],
    });
    try {
      if (interaction) {
        interaction.editReply({
          embeds: [userEmbed],
          components: [errorButton],
        }).catch(console.error);
        return;
      }
    } catch (err) {
      console.log(err);
    }
    console.error(message);
    return;
  } catch (err) {
    console.log("Could not log message");
    console.log(err);
  }
};

export const log = (message: Error, interaction: CommandInteraction) => {
  try {
    const embed = new EmbedBuilder()
      .setTitle(`Log: ${message}`)
      .setColor("#89CFF0")
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
        }
      );
    }
    log_hook.send({
      embeds: [embed],
    });
  } catch (err) {
    console.log("Could not log message");
    console.log(err);
  }
};
export const llog = (message: any) => {
  try {
    let getSecondsSinceEpoch = (x = new Date()) => (x.getTime() / 1000) | 0;

    log_hook.send(
      `Message Log: ${message} \n at <t:${getSecondsSinceEpoch()}:f>, <t:${getSecondsSinceEpoch()}:R>`
    );
  } catch (err) {
    console.log("Could not log message");
    console.log(err);
  }
};
export const addedGuildMessage = (embed: Embed) => {
  try {
    addRemoveHook.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
  }
};
export const removedGuildMessage = (embed: Embed| APIEmbed) => {
  try {
    addRemoveHook.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
  }
};
export const logStatus = ({
  cluster,
  shard,
  status,
}: {
  cluster: number;
  shard: number|string;
  status: string;
}) => {
  if (status === "starting") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is Starting -- Cluster ${cluster}, Shard ${shard} is starting`,
          timestamp: new Date(),
        },
      ],
    });
  }
  if (status === "online") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is Online -- Cluster ${cluster}, Shard ${shard} is online`,
          color: 65280,
          timestamp: new Date(),
        },
      ],
    });
  }
  if (status === "death") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is partially offline -- Cluster ${cluster}, Shard ${shard} is offline`,
          color: "16711680",
          timestamp: new Date(),
        },
      ],
    });
  }
  if (status === "reconnecting") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is partially offline -- Clusyer ${cluster}, Shard ${shard} is reconnecting`,
          color: "16737024",
          timestamp: new Date(),
        },
      ],
    });
  }
  if (status === "resumed") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is Online -- Cluster ${cluster}, Shard ${shard} has resumed`,
          color: "65280",
          timestamp: new Date(),
        },
      ],
    });
  }
};
