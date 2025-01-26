import { EventType } from "../../types";

export default class EntitlementCreateEvent implements EventType {
    name = "entitlementCreate";
    once = false;
    async execute() {
        console.log("An entitlement was created!");
    }
}