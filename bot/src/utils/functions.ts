import { PermissionResolvable, TextChannel } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";

export const formatNumber = (num: number) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const checkPermsForChannel = async (
  channel: TextChannel,
  perms: PermissionResolvable
) => {
  try {
    if (!channel || !channel.guild) {
      console.error("Invalid channel or guild in checkPermsForChannel");
      return false;
    }

    const botMember = await channel.guild.members.fetchMe().catch(() => null);
    if (!botMember) {
      console.error(`Cannot fetch bot member in guild ${channel.guild.id}`);
      return false;
    }

    const permissions = channel.permissionsFor(botMember);
    if (!permissions) {
      console.error(`Cannot get permissions for channel ${channel.id}`);
      return false;
    }

    return permissions.has(perms);
  } catch (err) {
    console.error("Error checking permissions:", err);
    return false;
  }
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
