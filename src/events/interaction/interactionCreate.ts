import {
  AutocompleteInteraction,
  Interaction
} from "discord.js";
import WelcomerClient from "../../models/Client";
import { EventType } from "../../types";
import { handleBetaGuild } from "../../utils/handler";
import { sendErrorMessage, sendInteractionMessage } from "../../utils/messages";

export default class InteractionCreateEvent implements EventType {
  name = "interactionCreate";
  once = false;
  async execute(
    interaction: Exclude<Interaction, AutocompleteInteraction>,
    client: WelcomerClient
  ) {
    // if (!interaction.inGuild() || !interaction.guild)
    //   return sendErrorMessage(
    //     interaction,
    //     "This command can only be used in a server."
    //   );
    try {

      if (interaction.guild) {

        await handleBetaGuild(interaction.guild, client);
      }

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
            await interaction.deferReply(command?.ephemeral ? { flags: "Ephemeral" } : undefined);
            await command.execute(interaction, client);
            client.logger.info(
              `Interaction command called: /${interaction.commandName}`,
              interaction
            );
          } catch (error) {
            console.error("There was an error on interactionCreate: ", error);
            await sendErrorMessage(
              interaction,
              `:warning: There was an error while executing this command!\n Please try again. ${error ? "```" + error + "```" : ""
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
                  flags: "Ephemeral",
                },
                true
              );
            }
            await selectMenu.execute(interaction, client);
          } catch (error) {
            console.error("There was an error on interactionCreate: ", error);
            await sendErrorMessage(
              interaction,
              `:warning: There was an error while executing this select menu!\n Please try again. ${error ? "```" + error + "```" : ""
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
                  flags: "Ephemeral",

                },
                true
              );
            }
            await button.execute(interaction, client);
          } catch (error) {
            console.error("There was an error on interactionCreate: ", error);
            await sendErrorMessage(
              interaction,
              `:warning: There was an error while executing this button!\n Please try again. ${error ? "```" + error + "```" : ""
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
      await interaction.deferReply({ flags: "Ephemeral" });
      await sendErrorMessage(
        interaction,
        `:warning: There was an error while executing this command! \n Please try again. ${error ? "```" + error + "```" : ""
        }`
      );
    }
  }
}
