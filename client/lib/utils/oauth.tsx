import DiscordOauth2 from "discord-oauth2";

let oauth: any;

if (typeof window === "undefined") {
  oauth = new DiscordOauth2();
}

export async function getUserGuilds(accessToken: string) {
  return oauth.getUserGuilds(accessToken);
}

export const runtime = "nodejs";

