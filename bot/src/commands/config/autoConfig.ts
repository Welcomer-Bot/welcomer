import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../../types";
import WelcomerClient from "../../structure/WelcomerClient";
import { sendInteractionMessage } from "../../utils/messages";
import { autoConfigEmbed } from "../../utils/embeds";
import { getGuild } from "../../utils/database";

export default class AutoConfigCommand implements CommandType {
    name = 'autoConfig';
    description = "Auto configure the bot with a few steps";
    data = new SlashCommandBuilder()
        .setName("autoconfig")
        .setDescription(this.description);

    async execute(interaction: ChatInputCommandInteraction | ButtonInteraction, client: WelcomerClient, ...options: any): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
        if (!interaction.guild) return await sendInteractionMessage(interaction, { content: "This command can only be used in a server." })
        
        let guildDb = await getGuild(interaction.guild.id)
        if(!guildDb) return await sendInteractionMessage(interaction, {content: "An error occured while trying to fetch the guild data. Try again or if the issue persisits, join the support server to get some help", ephemeral: true}) 
        await sendInteractionMessage(interaction, { embeds: [autoConfigEmbed(guildDb, client)] }, true)
    }
}