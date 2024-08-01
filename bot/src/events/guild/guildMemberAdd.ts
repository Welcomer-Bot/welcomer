
import { Client, GuildMember, InteractionResponse, Message } from 'discord.js';
import { EventType } from './../../types/index';
import { getWelcomeOptions } from '../../utils/database';
import WelcomerClient from '../../structure/WelcomerClient';
import { sendChannelMessage } from '../../utils/messages';
import { formatMessage } from '../../utils/welcomeModules/message';


export default class GuildMemberAdd implements EventType {
    name: string = 'guildMemberAdd';
    async execute(member: GuildMember, client: WelcomerClient): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
        let welcomeOptions = await getWelcomeOptions(member.guild);
        console.log(welcomeOptions)
        console.log(welcomeOptions.enabled)
        console.log(welcomeOptions.channel)
        if (!welcomeOptions?.enabled || welcomeOptions.channel == null) return console.log("The welcome module is not enabled or the channel is not set")
        let channel = member.guild.channels.cache.get(welcomeOptions.channel)
        if (!channel || !channel.isTextBased()) return console.log("The channel is not a valid text channel")
        if (member.partial) {
            await member.fetch().then(async (member) => {
                member = member as GuildMember
            }).catch((err) => {
                throw new Error("An error occured while trying to fetch the member: " + err)
            })
        }

        let message = await formatMessage(welcomeOptions, member)
        await sendChannelMessage(client, channel, message)





    }
    
}