import axios from "axios";
import { User } from "../../database/schemas";
import { GuildFormated } from "../../database/schemas/Guild";
import { DISCORD_API_BASE_URL } from "../../utils/constants";
import { Guild as GuildType, PartialGuild } from "../../utils/types";
import { fetchGuild } from "../database";


export async function fetchBotGuildsService(afterId?: string) {
    return await axios.get<PartialGuild[]>(`${DISCORD_API_BASE_URL}/users/@me/guilds`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        params: {
            after: afterId,
        },
    });
}

export async function getGuildService(id: String) {
    try {
        const guild = await fetchGuild(id);
        return guild;

    } catch (error) {
        throw new Error("Error fetching guild from database");
    }

}

export async function fetchUserGuildsService(id: String) {
    const user = await User.findOne({ id });
    if (!user) {
        throw new Error("User not found");
    }
    try {
        return await axios.get<PartialGuild[]>(`${DISCORD_API_BASE_URL}/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            },
        });
    } catch (error) {
        throw new Error("Error fetching user guilds");
    }
}

export async function fetchGuildService(id: String) {
    try {
        return await axios.get<GuildType>(`${DISCORD_API_BASE_URL}/guilds/${id}`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });
    } catch (error) {
        throw new Error("Error fetching guild");
    }

}

export const getAdminUserGuildsService = async (id: String) => {

    const { data: userGuilds } = await fetchUserGuildsService(id);
    return userGuilds.filter(({ permissions }) => (parseInt(permissions) & 0x8) === 0x8);
}

export const getMutualGuildsService = async (id: String) => {
    const guilds = <PartialGuild[] & GuildFormated[]>[];
    const adminUserGuilds = await getAdminUserGuildsService(id);
    // Use Promise.all to wait for all async operations inside the loop to complete
    await Promise.all(adminUserGuilds.map(async (userGuild) => {
        const guild = await getGuildService(userGuild.id);
        if (guild) {
            guild.mutual = true;
            guilds.push(guild);
        } else {
            guilds.push(userGuild);
        }
    }));
    return guilds;
};

export const getGuildPermissionsService = async (userId: String, guildId: String) => {
    try {
        const guilds = await getMutualGuildsService(userId);
        return guilds.some((guild) => guild.id === guildId);
    } catch (error) {
        console.log(error)
        return false;
    }
}
