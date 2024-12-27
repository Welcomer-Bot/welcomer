import { GuildMember, PermissionResolvable, TextChannel } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";

export const formatNumber = (num: number) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const checkPermsForChannel = async (
  channel: TextChannel,
  perms: PermissionResolvable
) => {
  if (
    !channel.permissionsFor(await channel.guild.members.fetchMe()).has(perms)
  ) {
    return false;
  }
  return true;
};

export async function waitForManager(
  client: WelcomerClient,
  cb?: () => unknown,
  intervalTime: number = 1000
): Promise<void> {
  if (client.managerReady) {
    if (cb) cb();
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        if (client.managerReady) {
          clearInterval(interval);
          if (cb) cb();
          resolve();
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, intervalTime);
  });
}

export function parseDiscordMessage(
  text: string | undefined,
  member: GuildMember,
  limit: number = 1999
) {
  const user = member.user;
  const guild = member.guild;
  if (!text) return text;
  return text
    .replace("{user}", user.tag)
    .replace("{userid}", user.id)
    .replace("{username}", user.globalName ? user.globalName : user.username)
    .replace("{guild}", guild.name)
    .replace("{guildid}", guild.id)
    .replace("{membercount}", guild.memberCount.toString())
    .substring(0, limit);
}
