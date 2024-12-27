import { GuildChannel } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType } from "../../types";

import { createOrUpdateGuild } from "../../utils/createGuild";

export default class ChannelCreate implements EventType {
  name = "channelCreate";
  async execute(channel: GuildChannel): Promise<void> {
    await createOrUpdateGuild(channel.guild);
  }
}
