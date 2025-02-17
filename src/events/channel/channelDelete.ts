import { GuildChannel, InteractionResponse, Message } from "discord.js";

import { deleteChannel } from "../../utils/database";
import { EventType } from "./../../types/index";

export default class ChannelDelete implements EventType {
  name: string = "channelDelete";
  async execute(
    channel: GuildChannel
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      await deleteChannel(channel.id);
    } catch {
      // error(err);
    }
  }
}
