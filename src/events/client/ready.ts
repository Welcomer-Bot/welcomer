import { REST } from "@discordjs/rest";
import { ActivityType, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import WelcomerClient from "../../models/Client";
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
        `/config`,
        `beta.welcomer.app`,
        `${(
          await client.cluster.broadcastEval(`this.guilds.cache.size`)
        ).reduce((prev, val) => prev + val, 0)} guilds`,
      ];

      const message = messages[Math.floor(Math.random() * messages.length)]!;
      client.user?.setActivity(message, { type: ActivityType.Watching });
    }
    if (client.cluster.id === 0) {
      client.server.startServer();
      await waitForManager(client);
      client.commands.forEach((command) => {
        if (!command.data.contexts) command.data.setContexts([0]);
      }
      );
      const globalCommands = client.commands.filter(command => !command.admin).map((command) => command.data.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[];
      const guildCommands = client.commands.filter(command => command.admin).map((command) => command.data.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[];
      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

      try {
        console.log("Started refreshing application (/) commands.");
        if (client.user?.id) {
          await rest.put(Routes.applicationCommands(client.user.id), { body: globalCommands });
          if (process.env.ADMIN_GUILD_ID)
            await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.ADMIN_GUILD_ID as string), { body: guildCommands });
        }

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    }
  }
}
