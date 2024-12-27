import { Guild } from "discord.js";

const serverUrl = process.env.SERVER_URL;

export const createOrUpdateGuild = async (guild: Guild) => {
  try {
    return await fetch(serverUrl + "/api/bot/updateGuilds", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`,
      }),
      body: JSON.stringify({
        guild: guild,
        channels: guild.channels.cache,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res.statusText);
        return { error: 'Failed to update guild' };
      }
    });
  } catch (error) {
    console.log(error);
  }
};
