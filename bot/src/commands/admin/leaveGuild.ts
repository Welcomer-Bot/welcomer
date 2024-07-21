import { ChatInputCommandInteraction, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";


export default class LeaveGuild implements CommandType {
    name = "leavegGuild";
    description = "Leave the given guid id in the parameter.";
    admin = true;
    data = new SlashCommandBuilder()
        .setName("leaveguild")
        .setDescription(this.description)
        .addStringOption((option) =>
            option.setName("guild_id")
                .setDescription("The guild id to leave")
                .setRequired(true)
        )
    async execute(interaction: ChatInputCommandInteraction, client: WelcomerClient, ...options: any): Promise<void | Message<boolean> | InteractionResponse<boolean>> {
        let guildId = interaction.options.getString("guild_id");
        if (!guildId || typeof (guildId) != "string") {
            return await sendInteractionMessage(interaction, { content: `The given guild id (${guildId}) is invalid !` })
        }
        let guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) {
            return await sendInteractionMessage(interaction, { content: "The given guild id couldn't be fetched because it is not in the bot cache" })
        }
        await guild.leave().then(async (guildLeaved) => {
            await sendInteractionMessage(interaction, { content: `Succesfully left ${guildLeaved.name}(${guildLeaved.id})` })
        })
            .catch(async (err) => {
                await sendInteractionMessage(interaction, { content: `Failed to leave ${guild}: ${err}` })
            })


    }
}