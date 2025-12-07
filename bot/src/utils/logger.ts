import { APIEmbed, CommandInteraction, Embed } from "discord.js";

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  WebhookClient,
} from "discord.js";

/**
 * @param {Client} client
 */

let log_hook: WebhookClient;
let addRemoveHook: WebhookClient;
let statusHook: WebhookClient;

function initHooks() {
  if (!log_hook) {
    log_hook = new WebhookClient({ url: process.env.LOGS_WEBHOOK! });
    addRemoveHook = new WebhookClient({ url: process.env.ADD_REMOVE_WEBHOOK! });
    statusHook = new WebhookClient({ url: process.env.STATUS_WEBHOOK! });
  }
}

export const error = (
  message: Error,
  interaction?: CommandInteraction
): void => {
  initHooks();
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
    ) as ActionRowBuilder<ButtonBuilder>;

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
        interaction
          .editReply({
            embeds: [userEmbed],
            components: [errorButton],
          })
          .catch(console.error);
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

export const log = (message: string, interaction: CommandInteraction) => {
  initHooks();
  try {
    const embed = new EmbedBuilder()
      .setTitle(`Log: ${message}`)
      .setColor("#89CFF0")
      .setTimestamp();
    if (interaction) {
      embed.addFields(
        {
          name: "From",
          value: `${interaction.guild?.name || "Unknown Guild"} (${
            interaction.guild?.id
          })`,
        },
        {
          name: "Triggered by",
          value: `${interaction.user.tag} (${interaction.user.id})`,
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
  initHooks();
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
  initHooks();
  try {
    addRemoveHook.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
  }
};
export const removedGuildMessage = (embed: Embed | APIEmbed) => {
  initHooks();
  try {
    addRemoveHook.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
  }
};
export const logStatus = ({
  clusterId,
  shardId,
  status,
}: {
  clusterId?: number;
  shardId: number | string;
  status: string;
}) => {
  initHooks();
  if (process.env.NODE_ENV === "development") return;
  if (status === "starting") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is Starting -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardId} are starting`,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
  if (status === "online") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is Online -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardId} are online`,
          color: 65280,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
  if (status === "death") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is partially offline -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardId} are offline`,
          color: 16711680,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
  if (status === "reconnecting") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is partially offline -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardId} are reconnecting`,
          color: 16737024,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
  if (status === "resumed") {
    statusHook.send({
      embeds: [
        {
          title: `Welcomer is Online -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardId} ares resumed`,
          color: 65280,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
  console.log(
    `Status: ${status} on ${
      clusterId ? `cluster ${clusterId},` : ""
    } shards ${shardId}`
  );
};
