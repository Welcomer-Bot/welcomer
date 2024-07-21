import { AutocompleteInteraction, BaseMessageOptions, Channel, ChatInputCommandInteraction, CommandInteraction, GuildBasedChannel, GuildMember, Interaction, InteractionReplyOptions, MessageCreateOptions, TextBasedChannel, User } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";

const baseMessage: BaseMessageOptions = {
    content: "",
    embeds: [],
    components: [],
    files: [],
}

export const sendInteractionMessage = async (interaction: Exclude<Interaction, AutocompleteInteraction>, message: InteractionReplyOptions = baseMessage, follow: Boolean = false) => {
    if (!interaction || !message) return console.log("Missing parameters for sendInteractionMessage")
    try {
        if (follow) {
            return (await interaction.followUp(message));
        } else if (interaction.deferred || interaction.replied) {
            return (await interaction.editReply(message));
        } else {
            return (await interaction.reply(message));
        }

    } catch (error) {
        console.log("An error occured in sendInteractionMessage function !", error)
        return;
    }

}

export const sendDmMessage = async (client: WelcomerClient, user: GuildMember, message: MessageCreateOptions = baseMessage) => {
    try {
        let fetchedUser = await client.users.fetch(user)
        return await fetchedUser.send(message);
    } catch (error) {
        return error; 
    }
}

export const sendChannelMessage = async (client: WelcomerClient, channel: TextBasedChannel, message: MessageCreateOptions = baseMessage) => { 
    try {
        return await channel.send(message);
    } catch (error) {
        console.log("An error occured in sendChannelMessage function !", error) 
        return error;
    }
}