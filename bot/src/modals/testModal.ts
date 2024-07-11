import { ModalMessageModalSubmitInteraction } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { modalType } from "../types/types";

export default class TestModal implements modalType {
    customId = "testModal";
    async execute(interaction: ModalMessageModalSubmitInteraction, client: WelcomerClient, ...options: any): Promise<void> {
        
    }
}