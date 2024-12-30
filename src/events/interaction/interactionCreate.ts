import {
  AutocompleteInteraction,
  Interaction,
  InteractionResponse,
  Message,
} from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType } from "../../types";
import { log } from "../../utils/logger";
import { sendErrorMessage, sendInteractionMessage } from "../../utils/messages";

export default class InteractionCreateEvent implements EventType {
  name = "interactionCreate";
  once = false;
  async execute(
    interaction: Exclude<Interaction, AutocompleteInteraction>,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    if (!interaction.inGuild())
      return sendErrorMessage(
        interaction,
        "This command can only be used in a server."
      );
    try {
      switch (true) {
        case interaction.isAutocomplete(): {
          return;
        }
        case interaction.isChatInputCommand(): {
          // interaction = interaction as ChatInputCommandInteraction;
          const command = client.commands.get(interaction.commandName);
          if (!command) return;
          try {
            if (command?.noDefer) return command.execute(interaction, client);
            await interaction.deferReply({ ephemeral: command?.ephemeral });
            await command.execute(interaction, client);
            log(
              `Interaction command called: /${interaction.commandName}`,
              interaction
            );
          } catch (error) {
            console.error("There was an error on interactionCreate: ", error);
            await sendErrorMessage(
              interaction,
              `:warning: There was an error while executing this command!\n Please try again. ${
                error ? "```" + error + "```" : ""
              }`
            );
          }
          break;
        }
        case interaction.isAnySelectMenu(): {
          const selectMenu = client.selectMenus.get(interaction.customId);
          if (!selectMenu) return;
          try {
            // await interaction.deferReply({ ephemeral: selectMenu.ephemeral });
            await interaction.deferUpdate();
            if (
              interaction.user.id !==
              interaction.message.interactionMetadata?.user.id
            ) {
              return sendInteractionMessage(
                interaction,
                {
                  content: "You are not allowed to use this command",
                  ephemeral: true,
                },
                true
              );
            }
            await selectMenu.execute(interaction, client);
          } catch (error) {
            console.error("There was an error on interactionCreate: ", error);
            await sendErrorMessage(
              interaction,
              `:warning: There was an error while executing this select menu!\n Please try again. ${
                error ? "```" + error + "```" : ""
              }`
            );
          }

          break;
        }
        case interaction.isButton(): {
          const button = client.buttons.get(interaction.customId);
          if (!button) return;
          try {
            await interaction.deferUpdate();
            if (
              interaction.user.id !==
              interaction.message.interactionMetadata?.user.id
            ) {
              return sendInteractionMessage(
                interaction,
                {
                  content: "You are not allowed to use this command",
                  ephemeral: true,
                },
                true
              );
            }
            await button.execute(interaction, client);
          } catch (error) {
            console.error("There was an error on interactionCreate: ", error);
            await sendErrorMessage(
              interaction,
              `:warning: There was an error while executing this button!\n Please try again. ${
                error ? "```" + error + "```" : ""
              }`
            );
          }
          break;
        }

        default: {
          await sendErrorMessage(
            interaction,
            "This interaction type is not supported or there was an error while handling your command !"
          );
        }
      }
    } catch (error) {
      console.error("There was an error on interactionCreate: ", error);
      if (!interaction.isAutocomplete()) {
        sendErrorMessage(
          interaction,
          `:warning: There was an error while executing this command! \n Please try again. ${
            error ? "```" + error + "```" : ""
          }`
        );
      }
    }
  }
}
