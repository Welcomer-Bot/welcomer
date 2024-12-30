import { ActivityType, ApplicationCommandType } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType } from "../../types";
import { waitForManager } from "../../utils/functions";


export default class ReadyEvent implements EventType {
    name = "ready";
    once = true;
    async execute(client: WelcomerClient) {
        console.log(`${client.user?.username} is ready (Cluster: ${client.cluster.id})!`)
        await setStatus();
        setInterval(async () => {
            await setStatus();
        }, 120000);

        async function setStatus() {
            const messages = [
                `/config`,
                `welcomer.app`,
                `${(await client.cluster.broadcastEval(`this.guilds.cache.size`)).reduce((prev, val) => prev + val, 0)} guilds`,
            ];

            const message = messages[Math.floor(Math.random() * messages.length)]!;
            client.user?.setActivity(message, { type: ActivityType.Watching });
        }
        if (client.cluster.id === 0) {
            await waitForManager(client);
            for (const command of client.commands.values()) {
                if (command.type !== ApplicationCommandType.ChatInput) continue;
                command.contexts = [0];
                command.dmPermission = false;
            }
            await client.application?.commands.set([...client.commands.values()]).then(async (commandsData) => {
                console.log("Commands registered!");
                // console.log(commandsData);
            })
        }


    };
}