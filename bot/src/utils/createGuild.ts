const serverUrl = process.env.SERVER_URL;

export const createOrUpdateGuild = async (guild: {
  channels: { cache: any };
}) => {
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
    console.log(error);
  }
};
