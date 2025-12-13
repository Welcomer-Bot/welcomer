import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { createOrUpdateGuild } from "../../utils/createGuild";
import { addMemberWelcomed, getGuild } from "../../utils/getGuild";
import { error } from "../../utils/logger";
import { welcomeCard } from "../../utils/welcomeCard";
import { EventType } from "./../../types/index";

export default class GuildMemberAdd implements EventType {
  name: string = "guildMemberAdd";
  async execute(
    member: GuildMember,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      if (!member?.guild) {
        console.error("Invalid member or guild in guildMemberAdd event");
        return;
      }

      const guild = member.guild;
      const guilds = await getGuild(guild.id);

      if (guilds) {
        if (guilds.welcomer?.enabled) {
          await welcomeCard(member, guild, guilds, client).catch((err) => {
            console.error(
              `Failed to send welcome card in guild ${guild.id}:`,
              err
            );
          });
        }

        if (guilds.welcomer?.enabled) {
          await addMemberWelcomed(guild).catch((err) => {
            console.error(
              `Failed to update welcome stats for guild ${guild.id}:`,
              err
            );
          });
        }
      } else {
        await createOrUpdateGuild(guild).catch((err) => {
          console.error(`Failed to create/update guild ${guild.id}:`, err);
        });
      }
    } catch (err: Error | any) {
      console.error("Critical error in guildMemberAdd:", err);
      error(err);
    }
  }
}
