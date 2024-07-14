import { ActionRowBuilder, ButtonBuilder, Guild, MessageCreateOptions } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType, GuildFormated } from "../../types/types";
import { dashButton, guildAddOwnerMessage, helpButtons } from "../../utils/constants";
import { createGuild } from "../../utils/database";
import { sendDmMessage } from "../../utils/messages";


export default class GuildCreate implements EventType {
    name = "guildCreate"
    async execute(guild: Guild, client: WelcomerClient): Promise<void> {
        let guildDb = await createGuild(guild)


        const guildOwner = await guild.fetchOwner()
        const message: MessageCreateOptions = {
            content: guildAddOwnerMessage(guildOwner, guild, guildDb as GuildFormated, client),
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(helpButtons, dashButton)]
        }
        sendDmMessage(client, guildOwner, message)


    }
}