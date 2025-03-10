import {
  ActionRowBuilder,
  AutocompleteInteraction,
  BaseMessageOptions,
  ButtonBuilder,
  GuildMember,
  GuildTextBasedChannel,
  Interaction,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  MessageCreateOptions,
} from "discord.js";
import WelcomerClient from "../models/Client";
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
  follow: boolean = false
): Promise<Message<boolean> | InteractionResponse | null> => {
  if (!interaction || !message)
    throw new Error("Missing parameters for sendInteractionMessage");
  // try {
    if (!interaction.isRepliable() || interaction.replied && interaction.fetchReply() === undefined) { 
      console.log("Interaction is not repliable");
      console.log(interaction)
      // await sendChannelMessage(interaction.channel, message as BaseMessageOptions);
  };
  if(!interaction.deferred)
  await interaction.deferReply();
    if (follow || interaction.ephemeral) {
      return await interaction.followUp({ ...message});
    }
      return await interaction.editReply(message);
  // } catch (error) {
  //   throw new Error(
  //     "An error occured in sendInteractionMessage function ! " + error
  //   );
  // }
};

export const sendDmMessage = async (
  client: WelcomerClient,
  user: GuildMember,
  message: MessageCreateOptions = baseMessage
) => {
  try {
    if (
      !message.content &&
      message.embeds?.length === 0 &&
      message.files?.length === 0
    )
      return;
    const fetchedUser = await client.users.fetch(user);
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
    if (
      !message.content &&
      message.embeds?.length === 0 &&
      message.files?.length === 0
    )
      return;
    return await channel.send(message);
  } catch (error) {
    console.log("An error occured in sendChannelMessage function !", error);
    return false;
  }
};

export const sendErrorMessage = async (
  interaction: Exclude<Interaction, AutocompleteInteraction>,
  error: string
) => {
  try {
    if (interaction.replied) {
      await interaction.fetchReply().then((msg) => {
        msg.removeAttachments();
      }).catch();
    }
    await sendInteractionMessage(
      interaction,
      {
        content: error,
        flags: "Ephemeral",

        embeds: [],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(helpButton),
        ],
        files: [],
      },
      true
    );
  } catch (err) {
    console.log("An error occured in sendErrorMessage function !", err);
    return;
  }
};

export const sendTempMessage = async (
  interaction: Exclude<Interaction, AutocompleteInteraction>,
  message: InteractionReplyOptions = baseMessage,
  follow: boolean = false,
  time: number = 5000
) => {
  try {
    const sentMessage = await sendInteractionMessage(
      interaction,
      message,
      follow
    );
    if (!sentMessage) return;
    setTimeout(async () => {
      sentMessage.fetch().then((msg) => {
        msg.delete();
      }).catch((error) => {
        console.log("An error occured in sendTempMessage function !", error);
      }
      );
    }, time);
  } catch (error) {
    throw `An error occured in sendTempMessage function: ${error}`;
  }
};
