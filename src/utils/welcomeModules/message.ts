import { Leaver, Welcomer } from "@prisma/client";
import {
  BaseMessageOptions,
  ColorResolvable,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { CompleteEmbed } from "../../types";
import { getEmbeds } from "../database";
import { MessageEmbedSchema, MessageSchema } from "./validator";

export function formatText(
  message: string | undefined,
  member: GuildMember
): string | undefined {
  if (!message) return undefined;
  return message
    .replaceAll(/{member}/g, member.toString())
    .replaceAll(/{tag}/g, member.user.tag)
    .replaceAll(/{username}/g, member.user.username)
    .replaceAll(/{id}/g, member.id)
    .replaceAll(/{displayname}/g, member.displayName)
    .replaceAll(/{discriminator}/g, member.user.discriminator)
    .replaceAll(
      /{roles}/g,
      member.roles.cache.map((role) => role.toString()).join(", ")
    )
    .replaceAll(/{permissions}/g, member.permissions.toArray().join(", "))
    .replaceAll(/{server}/g, member.guild.name)
    .replaceAll(/{membercount}/g, member.guild.memberCount.toString())
    .replaceAll(/{createdAt}/g, member.user.createdAt.toDateString())
    .replaceAll(/{joinedAt}/g, member.joinedAt!.toString())
    .replaceAll(/{joinedTimestamp}/g, member.joinedTimestamp!.toString())
    .replaceAll(
      /{joinedTimestampFormated}/g,
      `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`
    )
    .replaceAll(/{time}/g, new Date().toDateString());
}

export function formatEmbeds(
  embeds: CompleteEmbed[],
  member: GuildMember
): EmbedBuilder[] {
  return embeds.map((embed) => {
    return new EmbedBuilder()
      .setTitle(formatText(embed.title, member))
      .setDescription(formatText(embed.description, member))
      .setColor(embed.color as ColorResolvable)
      .setFooter(
        embed.footer
          ? {
              text: formatText(embed.footer.text, member),
              iconURL: embed.footer.iconUrl,
            }
          : undefined
      )
      .setAuthor(
        embed.author
          ? {
              name: formatText(embed.author.name, member),
              iconURL: embed.author.iconUrl,
            }
          : undefined
      )
      .setImage(embed.image?.url)
      .setThumbnail(embed.thumbnail)
      .setTimestamp(embed.timestampNow ? new Date() : embed.timestamp);
  });
}

export async function formatMessage(
  module: Welcomer | Leaver,
  moduleName: "welcomer" | "leaver",
  member: GuildMember
) {
  const embeds = await getEmbeds(moduleName, module.id);
  const message: BaseMessageOptions = {
    content: formatText(module.content, member),
    embeds: formatEmbeds(embeds, member),
  };

  const messageValidated = MessageSchema.safeParse(message);
  if (!messageValidated.success) {
    throw new Error(
      `Message validation failed: ${messageValidated.error.errors.join(", ")}`
    );
  }
  if (message.embeds) {
    message.embeds.forEach((embed) => {
      const embedValidated = MessageEmbedSchema.safeParse(embed);
      if (!embedValidated.success) {
        throw new Error(
          `Embed validation failed: ${embedValidated.error.errors.join(", ")}`
        );
      }
    });
  }

  return message;
}
