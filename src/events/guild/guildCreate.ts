import { ActionRowBuilder, ButtonBuilder, Guild } from "discord.js";
import WelcomerClient from "../../models/Client";
import { EventType } from "../../types";
import { dashButton, helpButton } from "../../utils/buttons";
import { embedHelperOnGuildCreate } from "../../utils/embeds";
import { handleBetaGuild } from "../../utils/handler";
import { sendChannelMessage } from "../../utils/messages";
import { fetchTextChannel } from "./../../utils/channel";

export default class GuildCreate implements EventType {
  name = "guildCreate";
  async execute(guild: Guild, client: WelcomerClient): Promise<void> {
    await handleBetaGuild(guild, client);
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
