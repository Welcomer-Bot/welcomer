import { InteractionReplyOptions, ChatInputCommandInteraction } from "discord.js";


export const sendInteractionMessage = async (interaction: ChatInputCommandInteraction, message: InteractionReplyOptions, follow: Boolean = false) => {
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