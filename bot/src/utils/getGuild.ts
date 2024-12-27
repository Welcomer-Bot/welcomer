import { Guild } from "discord.js";
import { GuildFormated } from '../database/schema/Guild';

const serverUrl = process.env.SERVER_URL;

export const getGuild = async (guildId: string) => {
  try {
    return await fetch(serverUrl + "/api/bot/guild/" + guildId, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SERVER_TOKEN}`,
      }),
    }).then(async (res) => {
      if (res.ok) {
        const data = (await res.json()) as { guild: GuildFormated };
        return data.guild;
      } else {
        return null;
      }
    });
  } catch (error) {
    return null;
  }
};

export const getGuildsStats = async () => {
  try {
    return await fetch(serverUrl + "/api/bot/guilds", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SERVER_TOKEN}`,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return null;
      }
    });
  } catch (error) {
    return null;
  }
};

export const addMemberWelcomed = async (guild: Guild) => {
  await fetch(serverUrl + "/api/bot/addMemberWelcomed/" + guild.id, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SERVER_TOKEN}`,
    }),
  }).then((res) => res.json());
};

export const addMemberGoodbye = async (guild: Guild) => {
  await fetch(serverUrl + "/api/bot/addMemberGoodbye/" + guild.id, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SERVER_TOKEN}`,
    }),
  }).then((res) => res.json());
};

export const deleteGuild = async function (id: string) {
  return await fetch(`${serverUrl}/api/bot/guild/${id}`, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SERVER_TOKEN}`,
    }),
  }).then((res) => {
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  });
};
