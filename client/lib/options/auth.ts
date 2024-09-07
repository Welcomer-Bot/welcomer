import Discord from "@auth/core/providers/discord";
import NextAuth, { Secrets } from "next-auth";
import { DiscordProfile } from "next-auth/providers/discord";
import { getUserGuilds } from "../utils/oauth";



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
    jwt: async({ token, account, profile }) => {

      if (account) {
        token.secrets = {
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          tokenType: account.tokenType,
          expiresAt: account.expires_at
        };
      };
      if (profile) {
        token.profile = profile;
      }
      
      return token;
    },
    session: async({ session, token }) => {

      session.profile = token.profile as DiscordProfile;

      if ((token?.secrets as Secrets).accessToken) { 
        // const guilds = await discord.getUserGuilds((token?.secrets as Secrets).accessToken);
        const guilds = await getUserGuilds((token?.secrets as Secrets).accessToken);
        // session.guilds = guilds.map((guild) => guild.id);
        // const managableGuilds = await getManageableGuilds(guilds);
        // session.guilds = managableGuilds.map((guild) => guild.id);
      } 

      return Promise.resolve(session);

    },
  },
});


export const runtime = "nodejs";












