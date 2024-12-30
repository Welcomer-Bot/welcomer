import { Guild } from "discord.js";
import { createGuild, getGuild, updateGuild } from "./database";

export const createOrUpdateGuild = async (guild: Guild) => {
    const existingGuild = await getGuild(guild.id);
    if (existingGuild) {
        return updateGuild(guild);
    } else {
        return createGuild(guild);
    }
}