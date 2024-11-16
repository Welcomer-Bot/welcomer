import { TextChannel, PermissionResolvable } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";

export const formatNumber = (num: number) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const checkPermsForChannel = async (channel: TextChannel, perms: PermissionResolvable) => {
    if (!channel.permissionsFor(await channel.guild.members.fetchMe()).has(perms)) {
        return false;
    }
    return true;
};

export async function waitForManager(client: WelcomerClient, cb?: () => unknown, intervalTime: number = 1000): Promise<void> {
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
    })
};