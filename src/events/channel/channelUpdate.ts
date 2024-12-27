import { DMChannel, GuildChannel } from "discord.js";
import { EventType } from "../../types";

import { createOrUpdateGuild } from "../../utils/createGuild";

export default class ChannelUpdate implements EventType {
  name = "channelUpdate";
    async execute(odlChannel: DMChannel | GuildChannel, newChannel: GuildChannel): Promise<void> {
        if (newChannel.isDMBased()) return; 
        await createOrUpdateGuild(newChannel.guild);
  }
}