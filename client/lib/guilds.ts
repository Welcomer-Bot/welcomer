import mongoose from "mongoose";

import connectDB from "./db";
const Guild = mongoose.model("Guild")

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
