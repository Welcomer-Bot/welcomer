import { ChatInputCommandInteraction, EmbedBuilder, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { CommandType } from "../../types";
import { connectionStatus } from "../../utils/database";
import { sendInteractionMessage } from "../../utils/messages";



function formatState(state: Number) {
    switch (state) {
        case 0:
            return "Ready";
        case 1:
            return "Connecting";
        case 2:
            return "Reconnecting";
        case 3:
            return "Idle";
        case 4:
            return "Nearly";
        case 5:
            return "Disconnected";
        case 6:
            return "Waiting for Guilds";
        case 7:
            return "Identifying";
        case 8:
            return "Resuming";

        default:
            return "Unknown";
    }
}

function formatDbState(state: Number) {
    switch (state) {
        case 0:
            return "Disconnected";
        case 1:
            return "Connected";
        case 2:
            return "Connecting";
        case 3:
            return "Disconnecting";
        default:
            return "Unknown";
    }
}

export default class StatusCommand implements CommandType {
    name = "status";
    description = "Get the bot status";
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);
    async execute(interaction: ChatInputCommandInteraction, client: WelcomerClient, ...options: any): Promise<void | Message<boolean> | InteractionResponse<boolean>> {

        if (!client.isReady()) {
            return sendInteractionMessage(interaction, { content: "The client is not ready yet" })
        }

        let statusEmbed = new EmbedBuilder()
            .setTitle(`${client.user?.username} status:`)
            .addFields(
                {
                    name: ":green_circle: State",
                    value: formatState(client.ws.status),
                    inline: true,
                },
                {
                    name: ":ping_pong: Discord API Ping",
                    value: `${client.ws.ping}ms`,
                    inline: true,
                },
                {
                    name: ":hourglass_flowing_sand: Uptime",
                    value: `<t:${client.readyTimestamp / 1000}:R> (${Math.floor(interaction.client.uptime / 1000 / 60)} minutes)`,
                    inline: true,
                },
                {
                    name: ":id: Cluster ID",
                    value: `${client.cluster.id}`,
                    inline: true,
                },
                {
                    name: ":id: Shard ID",
                    value: `${interaction.guild?.shardId}`,
                    inline: true,
                },
                {
                    name: ":desktop: Database Connection",
                    value: `${formatDbState(connectionStatus)}`,
                    inline: true,
                },
            )
            .setColor("#0099ff")
            .setTimestamp();
        await sendInteractionMessage(interaction, { embeds: [statusEmbed] })
    }

}