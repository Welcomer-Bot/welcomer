import WelcomerClient from "../models/Client";

export async function getChannelsPermissions(client: WelcomerClient, guildId: string) {
  const guild = await client.guilds.fetch(guildId);
  if (!guild) return null;

  const channels = guild.channels.cache.map(channel => {
    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      permissions: channel.permissionsFor(guild.client.user),
    };
  });

  return channels;
}

export async function getGuildPermissions(client: WelcomerClient, guildId: string) {
  const guild = await client.guilds.fetch(guildId);
  if (!guild) return null;

  const permissions = guild.members.me?.permissions
  return {
    id: guild.id,
    name: guild.name,
    permissions,
  };
}