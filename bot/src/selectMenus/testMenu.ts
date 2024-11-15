import {
  EmbedBuilder,
  GuildMember,
  InteractionResponse,
  Message,
  PermissionsBitField,
  StringSelectMenuInteraction,
  TextChannel,
} from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { checkPermsForChannel } from "../utils/functions";
import { getGuild } from "../utils/getGuild";
import { sendInteractionMessage } from "../utils/messages";
import { goodbyeCard, welcomeCard } from "../utils/welcomeCard";
import { SelectMenuType } from "./../types/index";

export default class TestMenu implements SelectMenuType {
  customId: string = "test-menu";
  ephemeral?: boolean | undefined = true;
  async execute(
    interaction: StringSelectMenuInteraction,
    client: WelcomerClient,
    ...options: any
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    let InfoEmbed = new EmbedBuilder();
    try {
      interaction.editReply({
        components: interaction.message.components,
      });
      if (!interaction.inGuild()) return;
      const value = interaction.values[0];
      let arg = value === "Welcome" ? "welcomer" : "goodbyeer";
      InfoEmbed.setTitle(`Testing ${value} message`);

      let guild = await getGuild(interaction.guild!.id);
      let guildModule = guild[arg];
      let realChannelId = guildModule.channel;

      var currentChannelPermissionErrors: string[] = [];
      var realChannelPermissionErrors: string[] = [];

      let realChannel = interaction.guild!.channels.cache.get(realChannelId);
      let currentChannel = interaction.channel;

      InfoEmbed.setColor("#33cc33")
        .setDescription(
          `This is a test function, test message will be sent in this channel, if ${value.toLowerCase()} module is not enabled, nothing will be sent.`
        )
        .addFields(
          {
            name: "``Enabled``",
            value: guildModule.enabled
              ? "**:white_check_mark:  enabled**"
              : "**<a:greytick:1011928045810090054> disabled**",
          },
          {
            name: "<:channel:1011932902637977650> ``Channel:``",
            value: guildModule.channel
              ? `<#${guildModule.channel}>`
              : "**NOT SET (No messages will be sent)**",
          },
          {
            name: "``Embeded:``",
            value: guildModule.embed.enabled
              ? "**:white_check_mark: enabled**"
              : "**<a:greytick:1011928045810090054> disabled**",
          }
        );

      const permissionNames = {
        [PermissionsBitField.Flags.SendMessages.toString()]: "Send Messages",
        [PermissionsBitField.Flags.EmbedLinks.toString()]: "Embed Links",
        [PermissionsBitField.Flags.AttachFiles.toString()]: "Attach Files",
      };

      for (let channel of [currentChannel, realChannel]) {
        if (!channel) continue;

        for (const perm of [
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.AttachFiles,
        ]) {
          if (!(await checkPermsForChannel(channel as TextChannel, perm))) {
            let permissionName = permissionNames[perm.toString()];
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

      switch (value) {
        case "Welcome":
          welcomeCard(
            interaction.member as GuildMember,
            interaction.guild!,
            guild,
            client,
            currentChannel as TextChannel
          );
          break;
        case "Goodbye":
          goodbyeCard(
            interaction.member as GuildMember,
            interaction.guild!,
            guild,
            client,
            currentChannel as TextChannel
          );
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
    sendInteractionMessage(
      interaction,
      { embeds: [InfoEmbed], ephemeral: true },
      true
    );
  }
}
