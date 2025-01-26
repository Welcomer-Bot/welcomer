import { GuildTextBasedChannel } from "discord.js";
import WelcomerClient from "../models/Client";

export const fetchTextChannel = (
  channelId: string,
  client: WelcomerClient
): GuildTextBasedChannel | null => {
  const channel = client.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased() || channel.isDMBased()) return null;
  return channel;
};
