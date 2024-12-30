import { EmbedBuilder, Guild, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "src/structure/WelcomerClient";
import { deleteGuild } from "src/utils/database";
import { EventType } from "../../types";

export default class GuildDelete implements EventType {
  name = "guildDelete";
  async execute(
    guild: Guild,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      await deleteGuild(guild.id);
      const removeEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Guild Removed")
        .setDescription(`**${guild.name}** (${guild.id})`)
        .addFields({
          name: "Members:",
          value: guild.memberCount + " members",
        })
        .setTimestamp();
      client.logger.addRemoveGuild(removeEmbed);
    } catch (err: Error | unknown) {
      client.logger.error(err as Error);
    }
  }
}
