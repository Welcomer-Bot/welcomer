import { AnySelectMenuInteraction, Interaction, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { sendInteractionMessage } from "../../utils/messages";
import { EventType } from './../../types/types';

export default class InteractionCreateEvent implements EventType {
  name = "interactionCreate";
  once = false;
  async execute(
    interaction: Interaction,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    if (!interaction.inGuild()) return;

    try {
      switch (true) {
        case interaction.isAutocomplete(): {
          return;
        }
        case interaction.isChatInputCommand(): {
          // interaction = interaction as ChatInputCommandInteraction;
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
        case interaction.isAnySelectMenu(): {
          let selectMenu = client.selectMenus.get(interaction.customId);
          if (!selectMenu) return;
          try {
            // await interaction.deferReply({ ephemeral: selectMenu.ephemeral });
            await interaction.deferUpdate()
            await selectMenu.execute(interaction, client);
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
    } catch (error) {
      console.error("There was an error on interactionCreate: ", error);
      if (!interaction.isAutocomplete()) {
        await sendInteractionMessage(interaction, {
          content:
            ":warning: There was an error while executing this command! \n Please try again.",
          ephemeral: true,
          embeds: [],
          components: [],

        });
      }
    }
  }
}