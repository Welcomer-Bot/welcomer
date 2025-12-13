import { EmbedBuilder, Guild, InteractionResponse, Message } from "discord.js";
import { EventType } from "../../types";
import { deleteGuild } from "../../utils/getGuild";
import { error, removedGuildMessage } from "../../utils/logger";

export default class GuildDelete implements EventType {
  name = "guildDelete";
  async execute(
    guild: Guild
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
      if (guild.name) {
        removedGuildMessage(removeEmbed.toJSON());
      }
    } catch (err: Error | any) {
      error(err);
    }
  }
}
