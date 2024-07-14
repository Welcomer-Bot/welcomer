import { ChatInputCommandInteraction, ModalMessageModalSubmitInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, Message, InteractionResponse, Guild } from "discord.js";
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
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

    execute(interaction: ChatInputCommandInteraction, client: WelcomerClient, ...options: any): Promise<void | Message<boolean> | InteractionResponse<boolean>>
}


export interface EventType {
    prodEvent?: boolean
    cluster?: boolean
    name: string,
    once?: boolean,
    execute(...args: any): Promise<void | InteractionResponse<boolean> | Message < boolean>>,
}

export type PartialGuild = {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
};

export interface GuildFormated {
    id: string;
    welcomer: Module;
    leaver: Module;
    mutual?: boolean;
    _tempData?: Guild
    _id?: string;
}

export type Channel = {
    id: string;
    name: string;
    type: number;
    permissions: string;
};

export type Role = {
    id: string;
    name: string;
    permissions: string;
};

export type Member = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    roles: string[];
    permissions: string;
};

export interface Module {
    enabled: boolean;
    dmEnabled: boolean;
    channel: string|null;
    message: string;
    dmMessage: string;
    image: ModuleImage[];
    embed: ModuleEmbed[];
    webhook: ModuleWebhook[];
};

export type ModuleImage = {
    enabled: boolean;
    backgroundId: string;
    theme: string;
};

export type ModuleEmbed = {
    enabled: boolean;
    title: string;
    description: string;
    color: string;
    footer: ModuleEmbedFooter[];
};

export type ModuleEmbedFooter = {
    enabled: boolean;
    text: string;
    icon: string;
};

export type ModuleWebhook = {
    enabled: boolean;
    id: string;
    name: string;
    avatar: string;
};
