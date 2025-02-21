import { ActionRowBuilder, ButtonBuilder, Guild } from "discord.js";
import WelcomerClient from "../../models/Client";
import { EventType } from "../../types";
import { dashButton, helpButton } from "../../utils/buttons";
import { createOrUpdateGuild, isGuildInBeta } from "../../utils/database";
import { betaInfoEmbedBuilder, embedHelperOnGuildCreate } from "../../utils/embeds";
import { sendChannelMessage, sendDmMessage } from "../../utils/messages";
import { fetchTextChannel } from "./../../utils/channel";

export default class GuildCreate implements EventType {
  name = "guildCreate";
  async execute(guild: Guild, client: WelcomerClient): Promise<void> {
    if (!(await isGuildInBeta(guild.id))) {
      const message = {
        embeds: [betaInfoEmbedBuilder],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            helpButton,
          ),
        ]
      };
      sendDmMessage(client, await guild.fetchOwner(), message);
      if (!guild.systemChannelId) return;
      const systemChannel = fetchTextChannel(guild.systemChannelId, client);
      if (systemChannel) {
        sendChannelMessage(systemChannel, message);
      }
      await guild.leave();
      return;
    }
    await createOrUpdateGuild(guild);
    if (!guild.systemChannelId) return;
    const systemChannel = fetchTextChannel(guild.systemChannelId, client);

    if (systemChannel) {
      sendChannelMessage(systemChannel, {
        embeds: [embedHelperOnGuildCreate],
        files: client.images.get("banner")?.attachment
          ? [client.images.get("banner")!.attachment]
          : [],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            helpButton,
            dashButton
          ),
        ],
      });
    }


  }
}
