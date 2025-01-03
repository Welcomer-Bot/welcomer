import { Leaver, Welcomer } from "@prisma/client";
import {
  EmbedBuilder,
  GuildMember,
  InteractionResponse,
  Message,
  PermissionsBitField,
  StringSelectMenuInteraction,
  TextChannel,
} from "discord.js";
import { getLeaver, getWelcomer } from "src/utils/database";
import WelcomerClient from "../structure/WelcomerClient";
import { checkPermsForChannel } from "../utils/functions";
import { sendInteractionMessage } from "../utils/messages";
import { generateCard } from "../utils/welcomeCard";
import { SelectMenuType } from "./../types/index";

export default class TestMenu implements SelectMenuType {
  customId: string = "test-menu";
  ephemeral?: boolean | undefined = true;
  async execute(
    interaction: StringSelectMenuInteraction,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    const InfoEmbed = new EmbedBuilder();
    try {
      interaction.editReply({
        components: interaction.message.components,
      });
      if (!interaction.inGuild()) return;
      const value = interaction.values[0];
      if (!value)
        return sendInteractionMessage(
          interaction,
          { content: "Unknown value", ephemeral: true },
          true
        );
      const arg = value === "Welcome" ? "welcomer" : "leaver";
      InfoEmbed.setTitle(`Testing ${value} message`);
      let guildModule: Welcomer | Leaver | null;
      if (arg === "welcomer") {
        guildModule = await getWelcomer(interaction.guild!.id);
      } else {
        guildModule = await getLeaver(interaction.guild!.id);
      }
      if (!guildModule)
        return sendInteractionMessage(
          interaction,
          {
            content: `No ${arg} module found. Please enable it first with the [dashboard](<https://welcomer.app>)`,
            ephemeral: true,
          },
          true
        );
      const realChannelId = guildModule.channelId;

      const currentChannelPermissionErrors: string[] = [];
      const realChannelPermissionErrors: string[] = [];

      const realChannel = interaction.guild!.channels.cache.get(realChannelId);
      let currentChannel = interaction.channel;

      if (!realChannel) {
        InfoEmbed.setColor("#ff0000").setDescription(
          `Channel is not set, please set it with the [dashboard](<https://welcomer.app>)`
        );
        return sendInteractionMessage(
          interaction,
          { embeds: [InfoEmbed], ephemeral: true },
          true
        );
      }

      InfoEmbed.setColor("#33cc33")
        .setDescription(
          `This is a test function, test message will be sent in this channel, if ${value.toLowerCase()} module is not enabled, nothing will be sent.`
        )
        .addFields({
          name: "<:channel:1011932902637977650> ``Channel:``",
          value: "<#" + guildModule.channelId + ">",
        });

      const permissionNames = {
        [PermissionsBitField.Flags.SendMessages.toString()]: "Send Messages",
        [PermissionsBitField.Flags.EmbedLinks.toString()]: "Embed Links",
        [PermissionsBitField.Flags.AttachFiles.toString()]: "Attach Files",
      };
      if (currentChannel === realChannel) {
        currentChannel = null;
      }

      for (const channel of [currentChannel, realChannel]) {
        if (!channel) continue;

        for (const perm of [
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.AttachFiles,
        ]) {
          if (!(await checkPermsForChannel(channel as TextChannel, perm))) {
            const permissionName = permissionNames[perm.toString()];
            if (!permissionName) continue;
            if (channel.id === realChannelId) {
              realChannelPermissionErrors.push(permissionName);
            } else {
              currentChannelPermissionErrors.push(permissionName);
            }
          }
        }
      }

      if (realChannelPermissionErrors.length > 0) {
        InfoEmbed.setColor("#ffae00");
        InfoEmbed.addFields({
          name: "<:error:1011936843257888768> ``Missing Permission(s)``",
          value:
            `In <#${realChannelId}>, messages will probably not be sent, please check the following missing permissions to be granted:` +
            "```" +
            realChannelPermissionErrors.join(", ") +
            "```",
        });
      }
      if (currentChannelPermissionErrors.length > 0) {
        InfoEmbed.setColor("#ffae00");
        InfoEmbed.addFields({
          name: "<:error:1011936843257888768> ``Missing Permission(s)``",
          value:
            `In <#${
              currentChannel!.id
            }>, messages will probably not be sent, please check the following missing permissions to be granted:` +
            "```" +
            currentChannelPermissionErrors.join(", ") +
            "```",
        });
      }

      await sendInteractionMessage(
        interaction,
        { embeds: [InfoEmbed], ephemeral: true },
        true
      );
      generateCard(
        interaction.member as GuildMember,
        interaction.guild!,
        guildModule,
        client,
        currentChannel,
        arg
      );
    } catch (error) {
      client.logger.error(error as Error);
    }
  }
}
