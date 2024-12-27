import { ActionRowBuilder, AutocompleteInteraction, BaseMessageOptions, ButtonBuilder, GuildMember, GuildTextBasedChannel, Interaction, InteractionReplyOptions, InteractionResponse, Message, MessageCreateOptions } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { helpButton } from "./buttons";

const baseMessage: BaseMessageOptions = {
    content: "",
    embeds: [],
    components: [],
    files: [],
}

export const sendInteractionMessage = async (interaction: Exclude<Interaction, AutocompleteInteraction>, message: InteractionReplyOptions = baseMessage, follow: Boolean = false): Promise<Message<boolean> | InteractionResponse> => {
    if (!interaction || !message) throw new Error("Missing parameters for sendInteractionMessage")
    try {
        if (follow) {
            return await interaction.followUp({ ...message, fetchReply: true });
        } else if (interaction.deferred || interaction.replied) {
            return await interaction.editReply(message);
        } else {
           return await interaction.reply(message);
        }
    } catch (error) {
        throw new Error("An error occured in sendInteractionMessage function ! " + error)
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

export const sendChannelMessage = async (channel: GuildTextBasedChannel, message: MessageCreateOptions = baseMessage) => {
    try {
        return await channel.send(message);
    } catch (error) {
        console.log("An error occured in sendChannelMessage function !", error)
        return error;
    }
}

export const sendErrorMessage = async (interaction: Exclude<Interaction, AutocompleteInteraction>, error: string) => {
    try {
        (await interaction.fetchReply()).removeAttachments();
        await sendInteractionMessage(
            interaction,
            {
                content: error,
                ephemeral: true,
                embeds: [],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents(helpButton)],
                files: [],
            },
            true
        );
    }catch{}
}

export const sendTempMessage = async (interaction: Exclude<Interaction, AutocompleteInteraction>, message: InteractionReplyOptions = baseMessage, follow: boolean=false, time: number = 5000) => {
    try {
        let sentMessage = await sendInteractionMessage(interaction, message, follow);
        setTimeout(async () => {
           sentMessage.delete();
        }, time);
    } catch (error) {
        throw(`An error occured in sendTempMessage function: ${error}`)
    }
}