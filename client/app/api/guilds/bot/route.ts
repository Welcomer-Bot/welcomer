
import { APIGuild } from 'discord-api-types/v10';

import { getBotGuilds } from '@/lib/guilds';
export async function GET(req: Request) {
  const accessToken = req.headers.get("Authorization")?.split(" ")[0];
  if (!accessToken) {
    return new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }
      const userGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 20,
        },
      });
  
  if(userGuilds.status !== 200) {
    return new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }
  const guilds: APIGuild[] = await userGuilds.json();
  const filteredGuilds: (Pick<APIGuild, "id" | "name" | "icon" | "owner" | "permissions"> & { mutual?: boolean })[] = guilds.filter(
            (guild) =>
              guild.owner ||
              (guild.permissions !== undefined &&
                Number(guild.permissions) & 0x8),
          )
          .map(({ id, name, icon, owner, permissions }) => ({
            id,
            name,
            icon: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png` : null,
            owner,
            permissions,
          }));

  const botGuilds = await getBotGuilds(filteredGuilds.map((guild) => guild.id));
 
  const resGuilds = filteredGuilds.map((guild) => {
    const foundGuild = botGuilds.find((g) => g.id === guild.id);
    if (foundGuild) {
      guild.mutual = true;
    }
    return guild;
  });

  return new Response(JSON.stringify(resGuilds), {
    headers: {
      "Content-Type": "application/json",
    },
  });

   //   if (res.ok) {
    //     const guilds: APIGuild[] = await res.json();
    //     // returns only the guild id and name
    //     session.user.guilds = guilds
    //       .filter(
    //         (guild: APIGuild) =>
    //           guild.owner ||
    //           (guild.permissions !== undefined &&
    //             Number(guild.permissions) & 0x20),
    //       )
    //       .map(({ id, name, icon, owner, permissions }) => ({
    //         id,
    //         name,
    //         icon,
    //         owner,
    //         permissions,
    //       }));
    //     const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    //     const mutualsGuilds = await fetch(`${baseUrl}/api/guilds/bot`);
    //     if (mutualsGuilds.status == 200) {
    //       const mutuals: GuildFormated[] = await mutualsGuilds.json();
    //       mutuals.forEach((guild) => {
    //       const foundGuild = session.user.guilds.find((g) => g.id === guild.id);
    //       if (foundGuild) {
    //         foundGuild.mutual = true;
    //       }
    //       })
    //     }
    //   }



  // const session = await auth();

  // if (!session) {
  //   return new Response(null, {
  //     status: 401,
  //     statusText: "Unauthorized",
  //   });
  // }

  
  // const adminGuilds = session.user.guilds.filter(({ permissions }) => (parseInt(permissions || "0") & 0x8) === 0x8);
  // const botGuilds = await getBotGuilds(adminGuilds.map((guild) => guild.id));

  // return new Response(JSON.stringify(botGuilds), {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });


}
