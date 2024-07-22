import { ButtonInteraction, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { ButtonType } from "../types";
import { sendInteractionMessage } from "../utils/messages";

export default class AutoConfigButton implements ButtonType {
    customId: string = "autoConfigButton";
    async execute(interaction: ButtonInteraction, client: WelcomerClient, ...options: any): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
        const autoconfigCommand = client.commands.get("autoconfig");

        if (!autoconfigCommand) {
            // If the command does not exist, send an error message
            return interaction.followUp({ content: "Autoconfig command not found.", ephemeral: true });
        }

        try {
            // Execute the "autoconfig" command logic
            await autoconfigCommand.execute(interaction, client);
        } catch (error) {
            console.error("Error executing autoconfig command from button:", error);
            await interaction.followUp({ content: "There was an error executing the autoconfig command.", ephemeral: true });
        }
    }
}