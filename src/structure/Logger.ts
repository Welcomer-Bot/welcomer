import { Cluster } from "discord-hybrid-sharding";
import { CommandInteraction, EmbedBuilder, WebhookClient } from "discord.js";
import { ErrorEmbed, StatusEmbed } from "./Embed";

export default class Logger {
  private logHook: WebhookClient;
  private statusHook: WebhookClient;
  private addRemoveHook: WebhookClient;

  constructor(logHook: string, statusHook: string, addRemoveHook: string) {
    this.logHook = new WebhookClient({ url: logHook });
    this.statusHook = new WebhookClient({ url: statusHook });
    this.addRemoveHook = new WebhookClient({ url: addRemoveHook });
  }

  public error(message: Error, interaction?: CommandInteraction): void {
    const embed = new ErrorEmbed(message.message, message.stack, interaction);
    this.logHook.send({
      embeds: [embed],
    });
  }

  public info(message: string, interaction?: CommandInteraction): void {
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
    this.logHook.send({
      embeds: [embed],
    });
  }

  public addRemoveGuild(embed: EmbedBuilder): void {
    this.addRemoveHook.send({ embeds: [embed] });
  }

  public status(cluster: Cluster, status: string): void {
    console.log(process.env.NODE_ENV);
    console.log(process.env.NODE_ENV !== "production");
    if (process.env.NODE_ENV !== "production") return;
    const embed = new StatusEmbed(
      cluster.id,
      cluster.shardList.join(","),
      status
    );
    this.statusHook.send({ embeds: [embed] });
  }

  public shardStatus(shardId: number, status: string): void {
    if (process.env.NODE_ENV !== "production") return;
    const embed = new StatusEmbed(undefined, shardId.toString(), status);
    this.statusHook.send({ embeds: [embed] });
  }
}
