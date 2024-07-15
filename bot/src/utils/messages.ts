import { AutocompleteInteraction, BaseMessageOptions, ChatInputCommandInteraction, CommandInteraction, GuildMember, Interaction, InteractionReplyOptions, MessageCreateOptions, User } from "discord.js";
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
            return await interaction.followUp(message);
        } else if (interaction.deferred || interaction.replied) {
            return await interaction.editReply(message);
        } else {
            return await interaction.reply(message);
        }

    } catch (error) {
        return console.log("An error occured in sendInteractionMessage function !", error)
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