import { BaseMessageOptions, EmbedBuilder, GuildMember } from "discord.js"
import { Module } from "../../types";


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
    message.content = formatText(options.message, member)
    options.embeds.forEach(async embed => {
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
        if (!message.embeds) {
            message.embeds = [];
        }
        message.embeds= [...message.embeds, embedBuilder.toJSON()]
    })

    if (!message.files) {
        message.files = [];
    }
    options.attachements.forEach(attachement => {
        message.files = [...(message.files ?? []), { attachment: attachement.url, name: attachement.filename }];
    });

    return message


}

// export async function generateEmbed(options: Module, member: GuildMember) {
//     let embed = new EmbedBuilder()
//     if(options.embed.title) {
//         embed.setTitle(formatText(options.embed.title, member))
//     }
//     if(options.embed.description) {
//         embed.setDescription(formatText(options.embed.description, member))
//     }
//     if(options.embed.color) {
//         embed.setColor(options.embed.color)
//     }
//     if(options.embed.footer.enabled) {
//         embed.setFooter({ text: formatText(options.embed.footer.text, member), iconURL: options.embed.footer.icon })
//     }
//     if(options.embed.timestamp) {
//         embed.setTimestamp()
//     }

//     return embed
// }
   