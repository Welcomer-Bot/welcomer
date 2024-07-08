import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";


export default interface CommandType {
    name: string;
    description: string;
    admin?: boolean;
    data: SlashCommandBuilder;
    
    execute(interaction: ChatInputCommandInteraction): Promise<void>
}