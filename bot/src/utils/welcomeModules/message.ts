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
    if (options.message) {
        message.content = formatText(options.message, member)
    }

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
   