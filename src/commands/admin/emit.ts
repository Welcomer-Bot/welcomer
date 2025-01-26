import {
  ActionRowBuilder,
  BaseMessageOptions,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import WelcomerClient from "../../models/Client";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";

export default class Emit implements CommandType {
  name = "emit";
  description = "Emit an event";
  admin = true;
  noDefer?: boolean | undefined = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient
  ): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
    if (!client.admins.includes(interaction.user.id))
      return sendInteractionMessage(interaction, {
        content: "You are not allowed to use this command.",
        ephemeral: true,
      });
    const emitMenu = new StringSelectMenuBuilder()
      .setCustomId("emitMenu")
      .setPlaceholder("Select an event to emit")
      .addOptions([
        {
          label: "guildCreate",
          value: "guildCreate",
        },
        {
          label: "guildDelete",
          value: "guildDelete",
        },
        {
          label: "guildMemberAdd",
          value: "guildMemberAdd",
        },
        {
          label: "guildMemberRemove",
          value: "guildMemberRemove",
        },
      ]);

    const message: BaseMessageOptions = {
      content: "",
      embeds: [
        new EmbedBuilder()
          .setTitle("Select an event to emit")
          .setColor("#161f2f"),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(emitMenu),
      ],
    };
    await sendInteractionMessage(interaction, message);
  }
}
