import { Guild } from "discord.js";
import { EventType } from "../../types";

import { createOrUpdateGuild } from "../../utils/createGuild";

export default class GuildCreate implements EventType {
  name = "guildCreate";
  async execute(guild: Guild): Promise<void> {
    await createOrUpdateGuild(guild);

    // let systemChannel = guild.systemChannelId ? await guild.channels.fetch(guild.systemChannelId) as TextChannel : null;

    // const guildOwner = await guild.fetchOwner();

    // const DmMessage: MessageCreateOptions = {
    //     content: guildAddOwnerMessage(guildOwner, guild, guildDb as GuildFormated, client),
    //     components: [new ActionRowBuilder<ButtonBuilder>().addComponents(helpButton, dashButton)]
    // }
    // sendDmMessage(client, guildOwner, DmMessage)
    // if (systemChannel) {
    //     sendChannelMessage(client, systemChannel, {
    //         embeds: [embedHelperOnGuildCreate],
    //         files: [client.images.get("banner")?.attachment as any],
    //         components: [new ActionRowBuilder<ButtonBuilder>().addComponents(autoConfigButton, helpButton, dashButton)]
    //     })
    // }
  }
}
