import { Guild } from "discord.js";

const serverUrl = process.env.SERVER_URL;

export const getGuild = async (guildId: string) => {
  try {
    const res = await fetch(serverUrl + "/api/bot/guild/" + guildId, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`,
      }),
    }).then((res) => res.json());
    if (res.error) {
      return null;
    }
    return res.guild;
  } catch (error) {
    return null;
  }
};

export const getGuildsStats = async () => {
  try {
    const res = await fetch(serverUrl + "/api/bot/guilds", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`,
      }),
    }).then((res) => res.json());
    if (res.error) {
      return null;
    }
    return res;
  } catch (error) {
    return null;
  }
};

export const addMemberWelcomed = async (guild: Guild) => {
  await fetch(serverUrl + "/api/bot/addMemberWelcomed/" + guild.id, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOKEN}`,
    }),
  }).then((res) => res.json());
};

export const addMemberGoodbye = async (guild: Guild) => {
  await fetch(serverUrl + "/api/bot/addMemberGoodbye/" + guild.id, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOKEN}`,
    }),
  }).then((res) => res.json());
};

export const deleteGuild = async function (id: string) {
  var res = await fetch(`${serverUrl}/api/bot/guild/${id}`, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOKEN}`,
    }),
  }).then((res) => res.json());
  if (res.error) {
    return false;
  }
  return true;
};
