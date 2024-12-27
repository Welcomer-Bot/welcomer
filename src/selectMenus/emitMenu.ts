import { Guild, GuildMember, InteractionResponse, Message, StringSelectMenuInteraction } from "discord.js";
import WelcomerClient from "../structure/WelcomerClient";
import { SelectMenuType } from "../types";
import { sendInteractionMessage, sendTempMessage } from "../utils/messages";


export default class EmitMenu implements SelectMenuType {
    customId: string = "emitMenu"
    async execute(interaction: StringSelectMenuInteraction, client: WelcomerClient): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
        const event = interaction.values[0];
        if (!client.admins.includes(interaction.user.id)) return sendInteractionMessage(interaction, { content: "You are not allowed to use this command.", ephemeral: true }, true);
        await interaction.editReply({ components: interaction.message.components });
        switch (event) {
            case "guildMemberAdd":
                await sendTempMessage(
                    interaction,
                    { content: "Emitted guildMemberAdd event" },
                    true
                );
                client.emit("guildMemberAdd", interaction.member as GuildMember);
                break;
            case "guildMemberRemove":
                await sendTempMessage(
                    interaction,
                    { content: "Emitted guildMemberRemove event" },
                    true
                );
                client.emit("guildMemberRemove", interaction.member as GuildMember);
                break;
            case "guildCreate":
                await sendTempMessage(
                    interaction,
                    { content: "Emitted guildCreate event" },
                    true
                );
                client.emit("guildCreate", interaction.guild as Guild);
                break;
            case "restartCluster":
                await sendInteractionMessage(
                    interaction,
                    { content: "Restarting Clusters..." },
                    true
                );
                client.cluster.respawnAll({ clusterDelay: 5000, respawnDelay: 5500, timeout: 30000 })

                break;
        }
    }
}