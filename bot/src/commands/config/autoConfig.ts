import { ButtonInteraction, ChatInputCommandInteraction, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { CommandType } from "../../types";
import { getGuild } from "../../utils/database";
import { autoConfigEmbed } from "../../utils/embeds";
import { sendInteractionMessage } from "../../utils/messages";
export default class AutoConfigCommand implements CommandType {
    name = 'autoConfig';
    description = "Automaticly configure the bot with a few steps";
    data = new SlashCommandBuilder()
        .setName("autoconfig")
        .setDescription(this.description);

    async execute(interaction: ChatInputCommandInteraction | ButtonInteraction, client: WelcomerClient, ...options: any): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
        if (!interaction.guild) return;

        let guildDb = await getGuild(interaction.guild)
        await sendInteractionMessage(interaction, { embeds: [autoConfigEmbed(guildDb, client)] }, true)

    }
}