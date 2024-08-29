import { APIGuild } from "discord-api-types/v10";
import NextAuth, { type DefaultSession } from "next-auth";

import Discord from "./node_modules/@auth/core/providers/discord";
import { GuildFormated } from "./lib/guilds";

declare module "next-auth" {
  interface Session {
    user: {
      guilds: (Pick<APIGuild, "id" | "name" | "icon" | "owner" | "permissions"> & { mutual?: boolean })[];
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl + "/dashboard";
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      const res = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
        next: {
          revalidate: 60,
        },
      });

      if (res.ok) {
        const guilds: APIGuild[] = await res.json();
        // returns only the guild id and name
        session.user.guilds = guilds
          .filter(
            (guild: APIGuild) =>
              guild.owner ||
              (guild.permissions !== undefined &&
                Number(guild.permissions) & 0x20),
          )
          .map(({ id, name, icon, owner, permissions }) => ({
            id,
            name,
            icon,
            owner,
            permissions,
          }));
        
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const mutualsGuilds = await fetch(`${baseUrl}/api/guilds/bot`);
        if (res.ok) {
          const mutuals: GuildFormated[] = await mutualsGuilds.json();
          mutuals.forEach((guild) => {
          const foundGuild = session.user.guilds.find((g) => g.id === guild.id);
          if (foundGuild) {
            foundGuild.mutual = true;
          }
          })
        }
      }
      console.log(session.user.guilds);
      return session;
    },
  },
});
