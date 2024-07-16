import WelcomerClient from "../structure/WelcomerClient"
import { GuildMember, Guild, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonComponent, ButtonComponentData } from "discord.js"
import { GuildFormated } from "../types/types";




export const guildAddOwnerMessage = function (user: GuildMember, guild: Guild, guildDb: GuildFormated, client: WelcomerClient) {
    const autoConfigCommand = client.commandsData.get("autoConfig");
    const editConfigCommand = client.commandsData.get("editConfig");
    const testCommand = client.commandsData.get("test");
    return `
# Hi ${user.user.username ?? "there"}, thanks for adding me to ${guild.name}(${guild.id})
    
> You or a guild administrator as added me to __${guild.name}__. I'm a bot that enhance the way of welcoming new users to your server with a large customization of your messages, with custom text, image, in image customization and much more...
     
**If you need help, you can join the support server by clicking the gray button bellow.**

## **How to get started with Welcomer ?** 

- You can use ${autoConfigCommand ? "</autoconfig:" + autoConfigCommand.id + ">" : "/autoconfig"} command in your server to start the configuration.
- At any moment, you can edit the currrent configuration with ${editConfigCommand ? "</editconfig" + editConfigCommand.id + ">" : "/editconfig"} command.
- You can test your configuration with ${testCommand ? "</test:" + testCommand.id + ">" : "/test"} command.

### Dashboard 

> If you want a more visual way of editing messages, you can use the web dashboard available [here](<https://welcomer.app/dashboard>) or with the Dashboard button bellow,


    ${guildDb?.welcomer.enabled ? `I was automatically configured because I found a candidate channel where to send welcome messages to <#${guildDb.welcomer.channel}>` : ``}
    ${guildDb?.leaver.enabled ? `I was automatically configured because I found a candidate channel where to send leave messages to <#${guildDb.leaver.channel}>` : ``}
    
    ${guildDb?.welcomer.enabled || guildDb?.leaver.enabled ? `You can edit or disable the automatic configuration by using the command ${editConfigCommand ? "</editconfig" + editConfigCommand.id + ">" : "/editconfig"} and edit/disable the module you want to edit/disable.` : ``}

    ${guildDb?.welcomer.enabled || guildDb?.leaver.enabled ? `You can also test the configuration with the command ${testCommand ? "</test:" + testCommand.id + ">" : "/test"}` : ``}

    ${guildDb?.welcomer.enabled || guildDb?.leaver.enabled ? `___` : ``}

    Welcomer Bot - Made with ❤️ by [Welcomer Team](<https://welcomer.app>)

-# This message has beens sent because you or a guild administrator has added me. This is an automated message.
    `
}



export const welcomeKeywords = ['welcome', 'greetings', 'hello'];
export const leaverkeywords = ['goodbye', 'adios', 'welcome']
