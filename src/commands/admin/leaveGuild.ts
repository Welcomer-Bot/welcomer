import {
  ChatInputCommandInteraction,
  Guild,
  InteractionResponse,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import WelcomerClient from "../../models/Client";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";

export default class LeaveGuild implements CommandType {
  name = "leavegguild";
  description = "Leave the given guid id in the parameter.";
  admin = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((option) =>
      option
        .setName("guild_id")
        .setDescription("The guild id to leave")
        .setRequired(true)
    );
  async execute(
    interaction: ChatInputCommandInteraction,
    client: WelcomerClient
  ): Promise<void | null | Message<boolean> | InteractionResponse<boolean>> {
    const guildId = interaction.options.getString("guild_id");
    if (!guildId || typeof guildId != "string") {
      return await sendInteractionMessage(interaction, {
        content: `The given guild id (${guildId}) is invalid !`,
      });
    }
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      return await sendInteractionMessage(interaction, {
        content:
          "The given guild id couldn't be fetched because it is not in the bot cache",
      });
    }
    await guild
      .leave()
      .then(async (guildLeaved: Guild) => {
        await sendInteractionMessage(interaction, {
          content: `Succesfully left ${guildLeaved.name}(${guildLeaved.id})`,
        });
      })
      .catch(async (err: Error) => {
        await sendInteractionMessage(interaction, {
          content: `Failed to leave ${guild}: ${err}`,
        });
      });
  }
}
