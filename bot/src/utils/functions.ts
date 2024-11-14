import { TextChannel, PermissionResolvable } from "discord.js";

export const formatNumber = (num: number) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const checkPermsForChannel = async (channel: TextChannel, perms: PermissionResolvable) => {
    if (!channel.permissionsFor(await channel.guild.members.fetchMe()).has(perms)) {
        return false;
    }
    return true;
}