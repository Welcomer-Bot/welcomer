import { Guild, InteractionResponse, Message } from "discord.js";
import { EventType } from "../../types";
import { deleteGuild } from "../../utils/database";


export default class GuildDelete implements EventType {
    name = "guildDelete";
    async execute(guild: Guild): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
        await deleteGuild(guild.id)
    }
}