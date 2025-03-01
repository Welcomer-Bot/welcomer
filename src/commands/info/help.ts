import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";


export default class implements CommandType {
    name = "help";
    description: string = "Get help with the bot";
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription("Get help with the bot")
        .addSubcommand((command) =>
            command
                .setName("config")
                .setDescription("How to configure the bot"))
        .addSubcommand((command) =>
            command
                .setName("test")
                .setDescription("How to test the bot")
        ) as SlashCommandBuilder;
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === "config") {
            await sendInteractionMessage(interaction, {
                content: "To configure the bot, use the `/config` command. This will open a menu where you can configure the bot's settings."
            });
        } else if (subcommand === "test") {
            await sendInteractionMessage(interaction, {
                content: "To test the",
            });

        }
    }
}
