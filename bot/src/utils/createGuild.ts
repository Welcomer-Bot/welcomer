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
        guild: {
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL(),
          ownerId: guild.ownerId,
          memberCount: guild.memberCount,
          channels: (await guild.channels.fetch()
            .then((channels) => {
              return channels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                type: channel.type,
              }));
            })
            .catch((err) => {
              console.log("Failed to fetch channels", err);
              return [];
            }))
        }
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log("Failed to update guild", res);
          return { error: "Failed to update guild" };
        }
      })
      .catch((err) => {
        console.log("Failed to update guild", err);
        return { error: "Failed to update guild" };
      });
  } catch (error) {
    console.log("Failed to update guild", error);
  }
};
