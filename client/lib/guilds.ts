
import connectDB from "./db";

import Guild from "@/schema/Guild";

export interface GuildFormated {
  id: string;
  name: string;
  icon: string;
  mutual?: boolean;
}

export async function getBotGuilds(guilds: string[]): Promise<GuildFormated[]> {
  try {
    await connectDB();

    const botGuilds = await Guild.find({ id: { $in: guilds } });

    return botGuilds;
  } catch (error) {
    return [];
  }
}
