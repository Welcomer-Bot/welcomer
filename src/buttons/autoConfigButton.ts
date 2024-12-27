import { ButtonInteraction, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { ButtonType } from "../types";

export default class AutoConfigButton implements ButtonType {
  customId: string = "autoConfigButton";
  async execute(
    interaction: ButtonInteraction,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    const autoconfigCommand = client.commands.get("autoconfig");

    if (!autoconfigCommand) {
      // If the command does not exist, send an error message
      return interaction.followUp({
        content: "Autoconfig command not found.",
        ephemeral: true,
      });
    }
    await autoconfigCommand.execute(interaction, client);
  }
}
