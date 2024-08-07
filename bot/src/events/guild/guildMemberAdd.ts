
import { GuildMember, InteractionResponse, Message } from 'discord.js';
import WelcomerClient from '../../structure/WelcomerClient';
import { fetchTextChannel } from '../../utils/channel';
import { getWelcomeOptions } from '../../utils/database';
import { sendChannelMessage } from '../../utils/messages';
import { formatMessage } from '../../utils/welcomeModules/message';
import { EventType } from './../../types/index';


export default class GuildMemberAdd implements EventType {
    name: string = 'guildMemberAdd';
    async execute(member: GuildMember, client: WelcomerClient): Promise<void | InteractionResponse<boolean> | Message<boolean>> {

        let welcomeOptions = await getWelcomeOptions(member.guild);
        if (welcomeOptions?.enabled && welcomeOptions.channel) {

            // Send message to the guild channel or webhook (TODO: Add webhook support)
            let channel = await fetchTextChannel(welcomeOptions.channel, client)
            let message = await formatMessage(welcomeOptions, member)
            await sendChannelMessage(client, channel, message)

            // Send DM to the new member
            if (welcomeOptions.dm) {
                let dmMessage = await formatMessage(welcomeOptions.dm, member)
                try {
                    await member.send(dmMessage)
                } catch (error) {
                    return;
                }
            }
        }






    }

}