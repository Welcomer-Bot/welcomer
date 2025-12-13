import {
  ActivityType,
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType } from "../../types";
import { waitForManager } from "../../utils/functions";

export default class ReadyEvent implements EventType {
  name = "ready";
  once = true;
  async execute(client: WelcomerClient) {
    console.log(
      `${client.user?.username} is ready (Cluster: ${client.cluster.id})!`
    );

    // Signal to cluster manager that this cluster is ready
    try {
      await client.cluster.send({ ready: true });
      console.log(`Cluster ${client.cluster.id} signaled ready to manager`);
    } catch (err) {
      console.error(`Failed to signal ready to cluster manager:`, err);
    }

    await setStatus();
    setInterval(async () => {
      await setStatus();
    }, 120000);

    async function setStatus() {
      client.user?.setActivity("BETA IS OPEN: beta.welcomer.app", {
        type: ActivityType.Custom,
      });
    }

    if (client.cluster.id === 0) {
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
