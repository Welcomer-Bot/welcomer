import { BaseMessageOptions, Guild } from "discord.js";
import { EventType } from "../../types/types";
import WelcomerClient from "../../structure/WelcomerClient";
import { sendDmMessage } from "../../utils/messages";
import { guildAddOwnerMessageEmbed } from "../../utils/embeds";


export default class GuildCreate implements EventType {
    name = "guildCreate"
    async execute(guild: Guild, client: WelcomerClient): Promise<void> {
        const guildOwner = await guild.fetchOwner()
        const message: BaseMessageOptions = {
            embeds: [guildAddOwnerMessageEmbed]
        }
        sendDmMessage(client, guildOwner, message )
    }
}