"use server";

import { redirect } from "next/navigation";

import { signIn } from "@/auth";

export async function SignIn() {
  return await signIn("discord");
}


export async function inviteBot(guildId: string) {
  redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&permissions=8&scope=bot&guild_id=${guildId}`);
}