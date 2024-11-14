import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";
import { testCommandMessage } from "../../utils/constants";

export default class implements CommandType {
    name = "test";
    description = "Test your current welcome/goodbye configuration";
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild || PermissionFlagsBits.Administrator);
    
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await sendInteractionMessage(interaction, testCommandMessage);
    }
}
