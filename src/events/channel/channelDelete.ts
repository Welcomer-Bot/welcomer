import { DMChannel, GuildChannel } from "discord.js";
import { EventType } from "../../types";

import { createOrUpdateGuild } from "../../utils/createGuild";

export default class ChannelDelete implements EventType {
  name = "channelDelete";
  async execute(channel: DMChannel | GuildChannel): Promise<void> {
    if (channel.isDMBased()) return;
    await createOrUpdateGuild(channel.guild);
  }
}
