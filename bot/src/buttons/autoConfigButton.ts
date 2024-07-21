import { ButtonInteraction, InteractionResponse, Message, ChatInputCommandInteraction } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { ButtonType } from "../types";
import { sendInteractionMessage } from "../utils/messages";

export default class AutoConfigButton implements ButtonType {
    customId: string = "autoConfigButton";
    async execute(interaction: ButtonInteraction, client: WelcomerClient, ...options: any): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
        let message = await sendInteractionMessage(interaction, { content: "Starting autoconfig..." }, true)
        console.log(message)
        if (!message?.interaction) return;
        console.log(client.commands)
        client.commands.get("autoconfig")?.execute(message.interaction as ChatInputCommandInteraction, client)
    }
}