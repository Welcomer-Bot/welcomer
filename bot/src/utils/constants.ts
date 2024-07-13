import WelcomerClient from "../structure/WelcomerClient"
import { GuildMember, Guild, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonComponent, ButtonComponentData } from "discord.js"




export const guildAddOwnerMessage = function (user: GuildMember, guild: Guild, client: WelcomerClient) {
    const autoConfigCommand = client.commandsData.get("autoConfig");
    const editConfigCommand = client.commandsData.get("editConfig");
    const testCommand = client.commandsData.get("test");
    return `# Hi ${user.user.username ?? "there"}, thanks for adding me to ${guild.name}(${guild.id})
    
    > You or a guild administrator as added me to __${guild.name}__. I'm a bot that enhance the way of welcoming new users to your server with a large customization of your messages, with custom text, image, in image customization and much more...
     
    **If you need help, you can join the support server by clicking the gray button bellow.**

    ## How to get started with Welcomer ? 

    - You can use ${autoConfigCommand ? "</autoconfig:" + autoConfigCommand.id + ">" : "/autoconfig"} command in your server to start the configuration.

    - At any moment, you can edit the currrent configuration with ${editConfigCommand ? "</editconfig" + editConfigCommand.id + ">" : "/editconfig"} command.
    
    - You can test your configuration with ${testCommand ? "</test:" + testCommand.id + ">" : "/test"} command.

    ### Dashboard 

    > If you want a more visual way of editing messages, you can use the web dashboard available [here](https://welcomer.app/dashboard) or with the Dashboard button bellow
    `
}
export const helpButtons = new ButtonBuilder()
    .setLabel("Support Server - Help")
    .setStyle(ButtonStyle.Link)
    .setURL("https://discord.com/invite/7TGc5ZZ7aM");
export const dashButton = new ButtonBuilder()
    .setLabel("Dashboard")
    .setStyle(ButtonStyle.Link)
    .setURL("https://welcomer.app/dahsboard");



