import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder } from "discord.js"
import WelcomerClient from "../models/Client"
import { helpButton } from "./buttons"
import { betaInfoEmbedBuilder } from "./embeds"
export function errorNotInBetaMessage(client: WelcomerClient): BaseMessageOptions {

    return {

        content: "-# https://discord.com/invite/7TGc5ZZ7aM",
        embeds: [betaInfoEmbedBuilder],
        files: client.images.get("banner")?.attachment
            ? [client.images.get("banner")!.attachment]
            : [],
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                helpButton,
            ),
        ]
    }
};
