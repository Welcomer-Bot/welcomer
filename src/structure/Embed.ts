import { CommandInteraction, EmbedBuilder } from "discord.js";

export class ErrorEmbed extends EmbedBuilder {
  constructor(
    message: string,
    stack?: string | undefined,
    interaction?: CommandInteraction
  ) {
    super();
    this.setTitle(
      `Error
          \n ${message}`
    )
      .setDescription(`**${stack || "No description provided"}**`)
      .setColor("#ff0000")
      .setTimestamp();
    if (interaction) {
      this.addFields(
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
}

export class StatusEmbed extends EmbedBuilder {
  constructor(clusterId: number | undefined, shardIds: string, status: string) {
    super();
    switch (status) {
      case "starting": {
        this.setTitle(
          `Welcomer is Starting -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are starting`
        ).setColor("#89CFF0");
        break;
      }
      case "ready": {
        this.setTitle(
          `Welcomer is Ready -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are ready`
        ).setColor("#89CFF0");
        break;
      }
      case "error": {
        this.setTitle(
          `Welcomer has encountered an error -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are errored`
        ).setColor("#ff0000");
        break;
      }
      case "disconnect": {
        this.setTitle(
          `Welcomer has disconnected -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are disconnected`
        ).setColor("#ff0000");
        break;
      }
      case "reconnecting": {
        this.setTitle(
          `Welcomer is Reconnecting -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are reconnecting`
        ).setColor("#ff0000");
        break;
      }
      case "resumed": {
        this.setTitle(
          `Welcomer has Resumed -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are resumed`
        ).setColor("#89CFF0");
        break;
      }
      case "death": {
        this.setTitle(
          `Welcomer is partially offline -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are offline`
        ).setColor("#ff0000");
        break;
      }
      case "online": {
        this.setTitle(
          `Welcomer is Online -- ${
            clusterId ? `cluster ${clusterId},` : ""
          } shards ${shardIds} are online`
        ).setColor("#89CFF0");
        break;
      }
      default:
        {
          this.setTitle(
            `Status ${status} -- ${
              clusterId ? `cluster ${clusterId},` : ""
            } shards ${shardIds}`
          );
        }
        this.setTimestamp();
    }
  }
}
