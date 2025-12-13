import {
  ActionRowBuilder,
  AutocompleteInteraction,
  BaseMessageOptions,
  ButtonBuilder,
  GuildMember,
  GuildTextBasedChannel,
  Interaction,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  MessageCreateOptions,
} from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { helpButton } from "./buttons";

const baseMessage: BaseMessageOptions = {
  content: "",
  embeds: [],
  components: [],
  files: [],
};

export const sendInteractionMessage = async (
  interaction: Exclude<Interaction, AutocompleteInteraction>,
  message: InteractionReplyOptions = baseMessage,
  follow: Boolean = false
): Promise<Message<boolean> | InteractionResponse | null> => {
  if (!interaction || !message) {
    console.error("Missing parameters for sendInteractionMessage");
    return null;
  }
  try {
    if (follow) {
      return await interaction.followUp({ ...message, fetchReply: true });
    } else if (interaction.deferred || interaction.replied) {
      return await interaction.editReply(
        message as InteractionEditReplyOptions
      );
    } else {
      return await interaction.reply(message);
    }
  } catch (error) {
    console.error("Error in sendInteractionMessage:", error);
    return null;
  }
};

export const sendDmMessage = async (
  client: WelcomerClient,
  user: GuildMember,
  message: MessageCreateOptions = baseMessage
) => {
  try {
    let fetchedUser = await client.users.fetch(user);
    return await fetchedUser.send(message);
  } catch (error) {
    return error;
  }
};

export const sendChannelMessage = async (
  channel: GuildTextBasedChannel,
  message: MessageCreateOptions = baseMessage
) => {
  try {
    return await channel.send(message);
  } catch (error) {
    console.log("An error occured in sendChannelMessage function !", error);
    return error;
  }
};

export const sendErrorMessage = async (
  interaction: Exclude<Interaction, AutocompleteInteraction>,
  error: string
) => {
  try {
    (await interaction.fetchReply()).removeAttachments();
    await sendInteractionMessage(
      interaction,
      {
        content: error,
        ephemeral: true,
        embeds: [],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(helpButton),
        ],
        files: [],
      },
      true
    );
  } catch {}
};

export const sendTempMessage = async (
  interaction: Exclude<Interaction, AutocompleteInteraction>,
  message: InteractionReplyOptions = baseMessage,
  follow: boolean = false,
  time: number = 5000
) => {
  try {
    let sentMessage = await sendInteractionMessage(
      interaction,
      message,
      follow
    );
    if (sentMessage) {
      setTimeout(async () => {
        try {
          await sentMessage.delete();
        } catch (deleteErr) {
          console.error("Failed to delete temp message:", deleteErr);
        }
      }, time);
    }
  } catch (error) {
    console.error("Error in sendTempMessage:", error);
  }
};
