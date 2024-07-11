import { ChatInputCommandInteraction, ModalMessageModalSubmitInteraction, SlashCommandBuilder } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";

export interface modalType {
    customId: string;
    execute(interaction: ModalMessageModalSubmitInteraction, client: WelcomerClient, ...options: any): Promise<void>
}

export interface CommandType {
    name: string;
    description: string;
    admin?: boolean;
    noDefer?: boolean;
    ephemeral?: boolean;
    data: SlashCommandBuilder;

    execute(interaction: ChatInputCommandInteraction, client: WelcomerClient): Promise<void>
}


export interface EventType {
    prodEvent?: boolean
    cluster?: boolean
    name: string,
    once?: boolean,
    execute(...args: any): Promise<void>,
}