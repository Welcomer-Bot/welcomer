import { AnySelectMenuInteraction, AutocompleteInteraction, BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction, GuildMember, Interaction, InteractionReplyOptions, InteractionResponse, Message, MessageCreateOptions, TextBasedChannel } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";

const baseMessage: BaseMessageOptions = {
    content: "",
    embeds: [],
    components: [],
    files: [],
}

export const sendInteractionMessage = async (interaction: ChatInputCommandInteraction | ButtonInteraction | AnySelectMenuInteraction, message: InteractionReplyOptions = baseMessage, follow: Boolean = false): Promise<Message<boolean> | void | InteractionResponse> => {
    if (!interaction || !message) return console.log("Missing parameters for sendInteractionMessage")
    try {
        if (follow) {
            await interaction.followUp({ ...message, fetchReply: true });
        } else if (interaction.deferred || interaction.replied) {
            await interaction.editReply(message);
        } else {
            await interaction.reply(message);
        }
        return interaction.fetchReply();

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