import { EmbedImage, Source } from "@prisma/client";
import { BaseCardParams, Color, DefaultCard } from "@welcomer-bot/card-canvas";
import {
  BaseMessageOptions,
  ColorResolvable,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import WelcomerClient from "../../models/Client";
import { CompleteEmbed } from "../../types";
import { MessageEmbedSchema, MessageSchema } from "./validator";

export function formatText(
  message: string,
  member: GuildMember,
  image: boolean = false
): string {
  return message
    .replaceAll(/{user}/g, image ? member.user.username : member.toString())
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
    .replaceAll(/{guild}/g, member.guild.name)
    .replaceAll(/{server}/g, member.guild.name)

    .replaceAll(/{membercount}/g, member.guild.memberCount.toString())
    .replaceAll(/{createdAt}/g, member.user.createdAt.toDateString())
    .replaceAll(/{joinedAt}/g, member.joinedAt!.toString())
    .replaceAll(/{joinedTimestamp}/g, member.joinedTimestamp!.toString())
    .replaceAll(
      /{joined}/g,
      `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`
    )
    .replaceAll(/{time}/g, new Date().toDateString());
}

export function formatEmbeds(
  embeds: CompleteEmbed[],
  member: GuildMember
): EmbedBuilder[] {
  return embeds
    .map((embed) => {
      try {
        return new EmbedBuilder()
          .setTitle(embed.title ? formatText(embed.title, member) : null)
          .setDescription(
            embed.description ? formatText(embed.description, member) : null
          )
          .setColor(embed.color as ColorResolvable)
          .setFields(
            embed.fields
              ? embed.fields
                  .filter((field) => field.name && field.value) // Vérifie que name et value sont définis
                  .map((field) => ({
                    name: formatText(field.name, member),
                    value: formatText(field.value, member),
                  }))
                  .slice(0, 25)
              : []
          )
          .setFooter(
            embed.footer && embed.footer.text
              ? {
                  text: formatText(embed.footer.text, member),
                  iconURL: embed.footer.iconUrl ?? undefined,
                }
              : null
          )
          .setAuthor(
            embed.author && embed.author.name
              ? {
                  name: formatText(embed.author.name, member),
                  iconURL: embed.author.iconUrl ?? undefined,
                  url: embed.author.url ?? undefined,
                }
              : null
          )
          .setImage(embed.image?.url ?? null)
          .setThumbnail(embed.thumbnail)
          .setTimestamp(embed.timestampNow ? new Date() : embed.timestamp);
      } catch (error) {
        console.log("err", error);
        return null;
      }
    })
    .filter((embed): embed is EmbedBuilder => embed !== null);
}

export async function formatMessage(
  source: Source,
  member: GuildMember,
  client: WelcomerClient,
  test: boolean = false
) {
  const embeds = await client.db.getEmbeds(source.type, source.guildId);
  // console.log("embeds", embeds);
  const cardParams = (await client.db.getSourceCard(
    source.guildId,
    source.type
  )) as BaseCardParams | null;
  if (cardParams?.mainText) {
    cardParams.mainText.content = formatText(
      cardParams.mainText.content,
      member,
      true
    );
  }
  if (cardParams?.nicknameText) {
    cardParams.nicknameText.content = formatText(
      cardParams.nicknameText.content,
      member,
      true
    );
  }
  if (cardParams?.secondText) {
    cardParams.secondText.content = formatText(
      cardParams.secondText.content,
      member,
      true
    );
  }

  const card = cardParams
    ? await new DefaultCard({
        ...cardParams,
        backgroundColor: cardParams.backgroundColor as Color,
        avatarBorderColor: cardParams.avatarBorderColor as Color,
        colorTextDefault: cardParams.colorTextDefault as Color,
        avatarImgURL: member.user.displayAvatarURL({
          extension: "png",
          forceStatic: true,
          size: 512,
        }),
      })
        .build()
        .then((built) => built.toBuffer())
    : null;
  const embed = embeds.find((embed) => embed.id === source.activeCardToEmbedId);
  if (embed) {
    embed.image = {
      url: "attachment://card.png",
    } as EmbedImage;
  }

  const embedsFormatted = formatEmbeds(embeds, member);
  // console.log("embedsFormatted", embedsFormatted);
  const message: BaseMessageOptions = {
    content: source.content ? formatText(source.content, member) : undefined,
    embeds: embedsFormatted,
    files: card ? [{ attachment: card, name: "card.png" }] : undefined,
  };

  const messageValidated = MessageSchema.safeParse(message);

  if (!messageValidated.success) {
    console.log(messageValidated.error.errors);
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
  if (source.guildId && !test) {
    client.db.updateGuildStatsGeneratedEmbeds(
      source.guildId,
      source.type,
      message.embeds?.length ?? 0
    );
    client.db.updateGuildStatsGeneratedImages(
      source.guildId,
      source.type,
      card ? 1 : 0
    );
    client.db.updateGuildStatsGeneratedMessages(source.guildId, source.type, 1);
    client.db.addMemberWelcomed(member.guild.id);
  }
  return message;
}
