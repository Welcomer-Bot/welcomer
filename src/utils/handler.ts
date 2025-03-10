import { Guild } from "discord.js";
import WelcomerClient from "../models/Client";
import { fetchTextChannel } from "./channel";
import { sendChannelMessage, sendDmMessage } from "./messages";
import { errorNotInBetaMessage } from "./text";

export async function handleBetaGuild(guild: Guild, client: WelcomerClient): Promise<void> {
    if (!(await client.db.isGuildInBeta(guild.id))) {
        const message = errorNotInBetaMessage(client);
        sendDmMessage(client, await guild.fetchOwner(), message);
        if (!guild.systemChannelId) return;
        const systemChannel = fetchTextChannel(guild.systemChannelId, client);
        if (systemChannel) {
            sendChannelMessage(systemChannel, message);
        }
        await guild.leave();
        throw new Error("Guild is not in beta");
    }
}