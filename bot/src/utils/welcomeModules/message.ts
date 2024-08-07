import { APIEmbed, BaseMessageOptions, GuildMember } from "discord.js";
import { Module } from "../../database/schema/Guild";
import WelcomerClient from "../../structure/WelcomerClient";
import { MessageEmbedSchema, MessageSchema } from "./validator";
import { fetchTextChannel } from "../channel";

export async function generateImage(member: GuildMember) {
    return "https://images.unsplash.com/photo-1721297015695-43027e98a178";
    // try {
    //   let canvas = await axios.get("https://api.welcomer.app/image/generate", {
    //     params: {
    //       guild: guild.id,
    //       member: member.id,
    //       avatar: member.user.displayAvatarURL({ format: "png" }),
    //       username: member.user.username,
    //       discriminator: member.user.discriminator,
    //       memberCount: guild.memberCount,
    //       guildName: guild.name,
    //     },
    //   });
    //   return canvas.data;
    // } catch {
    //   return null;
    // }
}

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
        .replaceAll(/{joinedTimestampFormated}/g, `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`)
        .replaceAll(/{time}/g, new Date().toDateString());
}

export function formatEmbeds(
    embeds: APIEmbed[],
    member: GuildMember
): APIEmbed[] {
    embeds.forEach((embed) => {
        embed.title = formatText(embed.title, member);
        embed.description = formatText(embed.description, member);
        if (embed.footer && embed.footer.text) {
            embed.footer.text = formatText(embed.footer.text, member)!;
        }
        if (embed.author && embed.author.name) {
            embed.author.name = formatText(embed.author.name, member)!;
        }
        embed.fields = embed.fields?.map((field) => {
            return {
                name: formatText(field.name, member) || "",
                value: formatText(field.value, member) || "",
                inline: field.inline || false,
            };
        });
        return embed;
    });

    return embeds;
}

export async function formatMessage(options: BaseMessageOptions, member: GuildMember) {
    let message: BaseMessageOptions = {
        content: formatText(options.content, member),
        embeds: formatEmbeds(options.embeds as APIEmbed[], member),
        files: options.files,
    };

    let messageValidated = MessageSchema.safeParse(message);
    if (!messageValidated.success) {
        throw new Error(
            `Message validation failed: ${messageValidated.error.errors.join(", ")}`
        );
    }
    if (message.embeds) {
        message.embeds.forEach((embed) => {
            let embedValidated = MessageEmbedSchema.safeParse(embed);
            if (!embedValidated.success) {
                throw new Error(
                    `Embed validation failed: ${embedValidated.error.errors.join(", ")}`
                );
            }
        });
    }

    return message;
}

