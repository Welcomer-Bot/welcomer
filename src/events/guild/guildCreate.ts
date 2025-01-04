import { ActionRowBuilder, ButtonBuilder, Guild } from "discord.js";
import WelcomerClient from "src/structure/WelcomerClient";
import { dashButton, helpButton } from "src/utils/buttons";
import { embedHelperOnGuildCreate } from "src/utils/embeds";
import { sendChannelMessage } from "src/utils/messages";
import { EventType } from "../../types";
import { fetchTextChannel } from "./../../utils/channel";
import { createOrUpdateGuild } from "src/utils/database";

export default class GuildCreate implements EventType {
  name = "guildCreate";
  async execute(guild: Guild, client: WelcomerClient): Promise<void> {
    await createOrUpdateGuild(guild);

    const systemChannel = fetchTextChannel(guild.systemChannelId, client);

    if (systemChannel) {
      sendChannelMessage(systemChannel, {
        embeds: [embedHelperOnGuildCreate],
        files: [client.images.get("banner")?.attachment],
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
