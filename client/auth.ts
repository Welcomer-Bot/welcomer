import { APIGuild } from "discord-api-types/v10";
import NextAuth, { type DefaultSession } from "next-auth";

import Discord from "./node_modules/@auth/core/providers/discord";

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
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/guilds/bot`, {
        headers: {
          Authorization: `${token.accessToken}`,
        },
        next: {
          revalidate: 20,
        }
      })
      if(res.status == 200) {
          session.user.guilds = await res.json();
        }
      return session;
    },
  },
});
