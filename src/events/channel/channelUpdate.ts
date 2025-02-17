import { GuildChannel, InteractionResponse, Message } from "discord.js";

import { createOrUpdateChannel } from "../../utils/database";
import { EventType } from "./../../types/index";

export default class ChannelUpdate implements EventType {
  name: string = "channelUpdate";
  async execute(
    channel: GuildChannel
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      await createOrUpdateChannel(channel);
    } catch {
      // error(err);
    }
  }
}
