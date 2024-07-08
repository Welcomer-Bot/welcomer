import WelcomerClient from "../structure/WelcomerClient";
import EventType from "../types/EventType";

export class ReadyEvent implements EventType {
    name = "ready";
    once = true;
    async execute(client: WelcomerClient) {
        console.log(`${client.user?.username} is ready !`)
    }


}