import { TextBasedChannel } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";

export const fetchTextChannel = async (
  channelId: string,
  client: WelcomerClient
): Promise<TextBasedChannel | null> => {
  try {
    let channel = client.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) {
      console.error(`Channel ${channelId} not found or not a text channel`);
      return null;
    }
    return channel;
  } catch (err) {
    console.error(`Error fetching text channel ${channelId}:`, err);
    return null;
  }
};
