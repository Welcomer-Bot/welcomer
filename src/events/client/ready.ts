import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import WelcomerClient, { API_URL, SERVER_TOKEN } from "../../models/Client";
import { EventType } from "../../types";
import { waitForManager } from "../../utils/functions";

export default class ReadyEvent implements EventType {
  name = "ready";
  once = true;
  async execute(client: WelcomerClient) {
    console.log(
      `${client.user?.username} is ready (Cluster ${client.cluster.id})!`
    );
    await setStatus();
    setInterval(async () => {
      await setStatus();
    }, 120000);

    async function setStatus() {
      const messages = [
        `/help`,
        `beta.welcomer.app`,
        `${(
          await client.cluster.broadcastEval(`this.guilds.cache.size`)
        ).reduce((prev, val) => prev + val, 0)} guilds`,
      ];

      const message = messages[Math.floor(Math.random() * messages.length)]!;
      client.user?.setActivity(message);
    }

    async function fetchClusterShardData() {
      if (!client.cluster) return;
      if (!client.isReady()) return;

      return {
        clusterId: client.cluster.id,
        shardIds: [...client.cluster.shardList],
        totalGuilds: client.guilds.cache.size,
        totalMembers: client.guilds.cache
          .map((g) => g.memberCount)
          .reduce((a, b) => a + b, 0),
        ping: client.ws.ping,
        uptime: Date.now() - client.uptime,
        memoryUsage: Number(
          Number(process.memoryUsage().rss / 1024 / 1024).toFixed(0)
        ),
        perShardCluster: [...client.cluster.shardList].map((shardId) => {
          const shard = client.ws.shards.get(shardId); // Get shard info
          if (!shard) return null;
          return {
            shardId: shard.id,
            status: shard?.status,
            ping: shard?.ping,
            guilds: client.guilds.cache.filter((x) => x.shardId === shardId)
              .size,
            members: client.guilds.cache
              .filter((x) => x.shardId === shardId)
              .map((g) => g.memberCount)
              .reduce((a, b) => a + b, 0),
          };
        }),
      };
    }

    async function postShardStats() {
      const shardData = await fetchClusterShardData();
      await fetch(API_URL + "/api/status/shard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: SERVER_TOKEN as string,
        },
        body: JSON.stringify({
          data: shardData,
        }),
      });
    }

    await postShardStats();
    setInterval(async () => {
      await postShardStats();
    }, 1000 * 20);

    if (client.cluster.id === 0) {
      client.server.startServer();
      await waitForManager(client);
      client.commands.forEach((command) => {
        if (!command.data.contexts) command.data.setContexts([0]);
      });
      const globalCommands = client.commands
        .filter((command) => !command.admin)
        .map((command) =>
          command.data.toJSON()
        ) as RESTPostAPIApplicationCommandsJSONBody[];
      const guildCommands = client.commands
        .filter((command) => command.admin)
        .map((command) =>
          command.data.toJSON()
        ) as RESTPostAPIApplicationCommandsJSONBody[];
      const rest = new REST({ version: "10" }).setToken(
        process.env.TOKEN as string
      );

      try {
        console.log("Started refreshing application (/) commands.");
        if (client.user?.id) {
          await rest.put(Routes.applicationCommands(client.user.id), {
            body: globalCommands,
          });
          if (process.env.ADMIN_GUILD_ID)
            await rest.put(
              Routes.applicationGuildCommands(
                client.user.id,
                process.env.ADMIN_GUILD_ID as string
              ),
              { body: guildCommands }
            );
        }

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(
          "An error occurred while reloading application (/) commands."
        );
        console.error(error);
      }
    }
  }
}
