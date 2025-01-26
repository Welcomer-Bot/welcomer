import { Embed } from "@prisma/client";
import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  InteractionResponse,
  Message,
  ModalMessageModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import WelcomerClient from "../models/Client";
import {
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
} from "./../../node_modules/.prisma/client/index.d";

export interface ModalType {
  customId: string;
  execute(
    interaction: ModalMessageModalSubmitInteraction,
    client: WelcomerClient,
    ...options: unknown[]
  ): Promise<void>;
}

export interface CommandType extends ChatInputApplicationCommandData {
  name: string;
  description: string;
  admin?: boolean;
  noDefer?: boolean;
  ephemeral?: boolean;
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

  execute(
    interaction: ChatInputCommandInteraction | ButtonInteraction,
    client: WelcomerClient,
    ...options: unknown[]
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>>;
}

export interface EventType {
  prodEvent?: boolean;
  cluster?: boolean;
  name: string;
  once?: boolean;
  execute(
    ...args: unknown[]
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>>;
}

export interface ButtonType {
  customId: string;
  execute(
    interaction: ButtonInteraction,
    client: WelcomerClient,
    ...options: unknown[]
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>>;
}

export interface SelectMenuType {
  customId: string;
  ephemeral?: boolean;
  execute(
    interaction: AnySelectMenuInteraction,
    client: WelcomerClient,
    ...options: unknown[]
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>>;
}

export type PartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
};

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

export type CompleteEmbed = Embed & {
  fields: EmbedField[] | null;
  author: EmbedAuthor | null;
  footer: EmbedFooter | null;
  image: EmbedImage | null;
};
