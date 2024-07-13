import { ChatInputCommandInteraction, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { sendInteractionMessage } from "../../utils/messages";
import {EventType} from './../../types/types';

export default class InteractionCreateEvent implements EventType {
  name = "interactionCreate";
  once = false;
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>>{
    if (!interaction.inGuild()) return;

    switch (true) {
      case interaction.isCommand(): {
        let command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
          if (command?.noDefer) return command.execute(interaction, client);
          await interaction.deferReply({ ephemeral: command?.ephemeral });
          await command.execute(interaction, client);
        } catch (error) {
          console.error("There was an error on interactionCreate: ", error);
          await sendInteractionMessage(interaction, {
            content:
              ":warning: There was an error while executing this command! \n Please try again.",
            ephemeral: true,
            embeds: [],
            components: [],
          });
        }
        break;
      }
        default: {
            sendInteractionMessage(interaction, {
                content: "This interaction type is not supported or there was an error while handling your command !",
                ephemeral: true,
                embeds: [],
                components: []
            })
      }
    }
  }
}
