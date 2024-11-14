import { ActionRowBuilder, BaseMessageOptions, BaseSelectMenuBuilder, EmbedBuilder, Guild, GuildMember, InteractionReplyOptions, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { GuildFormated } from "../database/schema/Guild";
import { BaseMessage } from "discord-hybrid-sharding";




export const guildAddOwnerMessage = function (user: GuildMember, guild: Guild, guildDb: GuildFormated, client: WelcomerClient) {
    const autoConfigCommand = client.commandsData.get("autoconfig");
    const editConfigCommand = client.commandsData.get("editconfig");
    const testCommand = client.commandsData.get("test");
    let message = `
# Hi ${user.user.username ?? "there"}, thanks for adding me to ${guild.name} (${guild.id})
    
> You or a guild administrator as added me to __${guild.name}__. I'm a bot that enhance the way of welcoming new users to your server with a large customization of your messages, with custom text, image, in image customization and much more...
     
**If you need help, you can join the support server by clicking the gray button bellow.**

## **How to get started with Welcomer ?** 

- You can use ${autoConfigCommand ? "</autoconfig:" + autoConfigCommand.id + ">" : "/autoconfig"} command in your server to start the configuration.
- At any moment, you can edit the currrent configuration with ${editConfigCommand ? "</editconfig" + editConfigCommand.id + ">" : "/editconfig"} command.
- You can test your configuration with ${testCommand ? "</test:" + testCommand.id + ">" : "/test"} command.

### Dashboard 

> If you want a more visual way of editing messages, you can use the web dashboard available [here](<https://welcomer.app/dashboard>) or with the Dashboard button bellow,
`

    if (guildDb?.welcomer.enabled) {
        message += `
I was automatically configured because I found a channel where to send welcome messages to <#${guildDb.welcomer.channel}>
    `;
    }

    if (guildDb?.leaver.enabled) {
        message += `
I was automatically configured because I found a channel where to send leave messages to <#${guildDb.leaver.channel}>
    `;
    }

    if (guildDb?.welcomer.enabled || guildDb?.leaver.enabled) {
        message += `
You can edit or disable the automatic configuration by using the command ${editConfigCommand ? "</editconfig" + editConfigCommand.id + ">" : "/editconfig"} and edit/disable the module you want to edit/disable.
You can also test the configuration with the command ${testCommand ? "</test:" + testCommand.id + ">" : "/test"}
`;
    }

    message += `
-# Welcomer Bot - Made with ❤️ by [Welcomer Team](<https://welcomer.app>)
-# This is an automated message sent from ${guild.name}.
    `

    return message;
}


export const welcomeKeywords = ['welcome', 'greetings', 'hello'];
export const leaverkeywords = ['goodbye', 'adios', 'welcome']


export const testSelectMenu = new StringSelectMenuBuilder()
  .setCustomId("test-menu")
  .setOptions(
    new StringSelectMenuOptionBuilder({
      label: "Test User Joining",
      value: "Welcome",
      emoji: {
        name: "join",
        id: "1011593313314410496",
      },
    }),
    new StringSelectMenuOptionBuilder({
      label: "Test User Leaving",
      value: "Goodbye",
      emoji: {
        name: "leave",
        id: "1011593334466297918",
      },
    })
);
  
export const testCommandMessage: InteractionReplyOptions = {
    ephemeral: true,
  embeds: [
           new EmbedBuilder()
            .setTitle("Select an event to test :arrow_heading_down: ")
            .setColor("#161f2f"),
    ],
    components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(testSelectMenu)],
} 
