import { APIGuild } from "discord-api-types/v10";
import NextAuth, { type DefaultSession } from "next-auth";

import Discord from "./node_modules/@auth/core/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      guilds: APIGuild[];
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
        session.user.guilds = await res.json();
        let guildsIds = session.user.guilds.map((guild) => guild.id);
      }

      return session;
    },
  },
});
