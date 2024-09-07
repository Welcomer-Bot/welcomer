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
  return null;

}

// export async function getManageableGuilds(guilds: PartialGuild[]) {
//   return guilds.filter((guild) => guild.owner || (guild.permissions !== undefined && Number(guild.permissions) & 0x8))
// }