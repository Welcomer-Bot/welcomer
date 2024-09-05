"use server";

import connectDB from "./db";

import Guild from "@/schema/Guild";

export interface GuildFormated {
  json(): any;
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

export async function getGuild(id: string): Promise<GuildFormated | null> {
  try {
    await connectDB();

    const guild = await
      Guild.findOne({ id });

    return guild;
  }
  catch (error) {
    return null;
  }
}
