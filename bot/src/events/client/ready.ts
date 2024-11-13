import { ActivityType } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { EventType } from "../../types";


export default class ReadyEvent implements EventType {
    name = "ready";
    once = true;
    async execute(client: WelcomerClient) {
        console.log(`${client.user?.username} is ready (Cluster: ${client.cluster.id})!`)
        // trigger the clusterReady event
        client.cluster.emit("clusterReady", client.cluster);

        async function setStatus() {
            let messages = [
                `/config`,
                `welcomer.app`,
                `${(await client.cluster.broadcastEval(`this.guilds.cache.size`)).reduce((prev, val) => prev + val, 0)} guilds`,
            ];

            let message = messages[Math.floor(Math.random() * messages.length)];
            client.user?.setActivity(message, { type: ActivityType.Watching });
        }

        await setStatus();

        setInterval(async () => {
            await setStatus();
        }, 120000);
    };
}