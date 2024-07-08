import { Collection } from "discord.js";
import EventType from "../types/EventType";
import { loadFiles } from "./loader";
import WelcomerClient from "./WelcomerClient";

const loadEvents = async function (client: WelcomerClient) {

    client.events = new Collection();
    let events = new Array();
    let files = await loadFiles("src/events");
    for (let file of files) {
        try {
            let event: EventType = require(file);
            let execute = (...args: any[]) => event.execute(...args, client);
            let target = event.cluster ? client.cluster : client;
            if (event.prodEvent && process.env.NODE_ENV?.trim() !== "production")
                continue;
            (target as WelcomerClient)[event.once ? "once" : "on"](event.name, execute);
            client.events.set(event.name, event);
            events.push({ Event: event.name, Status: "✅" });
        } catch (e) {
            events.push({ Event: file, Status: "❌" });
            console.error(e)
        }
    }
    console.log(`Loaded ${events.length} events.`);
    console.table(events)
}

export default loadEvents