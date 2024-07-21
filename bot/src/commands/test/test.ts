import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../../types";
import { createGuild } from "../../utils/database";
import { sendInteractionMessage } from "../../utils/messages";


export default class implements CommandType {
    name = 'ping';
    description = "Ping the bot !";
    data = new SlashCommandBuilder()
        .setName("ping")
        .setDescription(this.description);
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        let embed = new EmbedBuilder()
            .setTitle(`Pong!`)
            .setDescription(`🏓 ${interaction.client.ws.ping}ms`)
            .setColor(`#FF0000`)
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp()
        await createGuild(interaction.guild!)
        await sendInteractionMessage(interaction, { embeds: [embed] })


    }



}