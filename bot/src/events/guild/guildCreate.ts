import { ActionRowBuilder, ButtonBuilder, Guild, MessageCreateOptions, TextChannel } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType } from "../../types";
import { guildAddOwnerMessage } from "../../utils/constants";
import { embedHelperOnGuildCreate } from "../../utils/embeds";

import { autoConfigButton, dashButton, helpButton } from "../../utils/buttons";
import { sendChannelMessage, sendDmMessage } from "../../utils/messages";
import { GuildFormated } from './../../database/schema/Guild';
import { getGuild } from "../../utils/getGuild";


export default class GuildCreate implements EventType {
    name = "guildCreate"
    async execute(guild: Guild, client: WelcomerClient): Promise<void> {
        let guildDb = await getGuild(guild.id);
        let systemChannel = guild.systemChannelId ? await guild.channels.fetch(guild.systemChannelId) as TextChannel : null;

        const guildOwner = await guild.fetchOwner();

        const DmMessage: MessageCreateOptions = {
            content: guildAddOwnerMessage(guildOwner, guild, guildDb as GuildFormated, client),
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(helpButton, dashButton)]
        }
        sendDmMessage(client, guildOwner, DmMessage)
        if (systemChannel) {
            sendChannelMessage(client, systemChannel, {
                embeds: [embedHelperOnGuildCreate],
                files: [client.images.get("banner")?.attachment as any],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents(autoConfigButton, helpButton, dashButton)]
            })
        }
    }
}