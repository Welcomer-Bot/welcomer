import { Channel, DMChannel, Guild, GuildChannel } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType } from "../../types";

import { getGuild } from "../../utils/getGuild";
import { createOrUpdateGuild } from "../../utils/createGuild";

export default class ChannelDelete implements EventType {
  name = "channelDelete";
    async execute(channel: DMChannel | GuildChannel, client: WelcomerClient): Promise<void> {
        if (channel.isDMBased()) return;
    await createOrUpdateGuild(channel.guild);
  }
}
