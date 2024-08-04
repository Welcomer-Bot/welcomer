import { APIEmbed, BaseMessageOptions, EmbedBuilder, GuildMember, JSONEncodable } from "discord.js";
import { WelcomerEmbed } from "../../database/schema/APISchemas/Embed";
import { Module } from "../../database/schema/Guild";


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

export function formatText(message: string, member: GuildMember) {
    return message
        .replaceAll(/{member}/g, member.toString())
        .replaceAll(/{tag}/g, member.user.tag)
        .replaceAll(/{username}/g, member.user.username)
        .replaceAll(/{id}/g, member.id)
        .replaceAll(/{displayname}/g, member.displayName)
        .replaceAll(/{discriminator}/g, member.user.discriminator)
        .replaceAll(/{roles}/g, member.roles.cache.map(role => role.toString()).join(", "))
        .replaceAll(/{permissions}/g, member.permissions.toArray().join(", "))
        .replaceAll(/{server}/g, member.guild.name)
        .replaceAll(/{membercount}/g, member.guild.memberCount.toString())
        .replaceAll(/{createdAt}/g, member.user.createdAt.toDateString())
        .replaceAll(/{joinedAt}/g, member.joinedAt!.toDateString())
        .replaceAll(/{time}/g, new Date().toDateString())
}

export async function formatMessage(options: Module, member: GuildMember) {
    let message: BaseMessageOptions = {
        content: undefined,
        embeds: [],
        components: [],
        files: [],
    }

    // if (!checkTextLength(options, member)) {
    //     throw new Error("The message is too long")
    // }    
    message.content = formatText(options.message, member);
    
    for (const embed of options.embeds) {
        let embedBuilt = await generateEmbed(embed, member);
        if (!message.embeds) {
            message.embeds = [];
        }
        message.embeds = [...message.embeds, embedBuilt];
    }
    
    if (!message.files) {
        message.files = [];
    }
    
    options.attachements.forEach(attachement => {
        message.files = [...(message.files ?? []), { attachment: attachement.url, name: attachement.filename }];
    });
    if (isTextTooLong(message)) throw new Error("The message is too long")
    
    return message


}

export async function generateEmbed(embed: WelcomerEmbed, member: GuildMember) {
    let embedBuilder = new EmbedBuilder()
    if (embed.title) {
        embedBuilder.setTitle(formatText(embed.title, member))
    }
    if (embed.description) {
        embedBuilder.setDescription(formatText(embed.description, member))
    }
    if (embed.color) {
        embedBuilder.setColor(embed.color)
    }
    if (embed.footer?.text) {
        embedBuilder.setFooter({ text: formatText(embed.footer.text, member), iconURL: embed.footer.icon_url })
    }
    if (embed.footer?.icon_url) {
        embedBuilder.setFooter({ text: formatText(embed.footer.text, member), iconURL: embed.footer.icon_url })
    }
    if (embed.image?.url) {
        embedBuilder.setImage(embed.image.url)
    }
    if (embed.image?.isGeneratedImage) {
        embedBuilder.setImage(await generateImage(member))
    }
    if (embed.timestamp) {
        embedBuilder.setTimestamp()
    }
    if (embed.thumbnail.url) {
        embedBuilder.setThumbnail(embed.thumbnail.url)
    }
    if (embed.author.name) {
        embedBuilder.setAuthor({ name: formatText(embed.author.name, member), iconURL: embed.author.icon_url, url: embed.author.url })
    }
    if (embed.fields) {
        embedBuilder.addFields(embed.fields.map(field => {
            return {
                name: formatText(field.name, member),
                value: formatText(field.value, member),
                inline: field.inline
            }
        }))
    }

    return embedBuilder
}


export function isTextTooLong(message: BaseMessageOptions, maxlength: number = 6000) {
    let count = {
        content: 0,
        embedsCount: 0,
        embeds: 0,
    }

    message.content && (count.content += message.content.length)
    message.embeds && message.embeds.forEach(embed => {
        count.embedsCount++
        embed = embed as APIEmbed
        embed.title && (count.embeds += embed.title.length)
        embed.description && (count.embeds += embed.description.length)
        embed.footer && embed.footer.text && (count.embeds += embed.footer.text.length)
        embed.author && embed.author.name && (count.embeds += embed.author.name.length)
        embed.fields && embed.fields.length > 25 && (count.embeds += 6000)
        embed.fields && embed.fields.forEach(field => {
            count.embeds += field.name.length + field.value.length  
        })
    })

    return ((count.content + count.embeds <= maxlength) && count.embedsCount <= 10)
}