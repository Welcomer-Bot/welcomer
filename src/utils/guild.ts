import { Guild } from "discord.js";
import { createGuild, getGuild, updateGuild } from "./database";

export const createOrUpdateGuild = async (guild: Guild) => {
    const existingGuild = await getGuild(guild.id);
    if (existingGuild) {
        return await updateGuild(guild);
    } else {
        return await createGuild(guild);
    }
}