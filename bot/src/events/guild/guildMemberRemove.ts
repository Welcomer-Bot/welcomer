import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { createOrUpdateGuild } from "../../utils/createGuild";
import { addMemberGoodbye, getGuild } from "../../utils/getGuild";
import { goodbyeCard } from "./../../utils/welcomeCard";

import { error } from "../../utils/logger";
import { EventType } from "./../../types/index";

export default class GuildMemberRemove implements EventType {
  name: string = "guildMemberRemove";
  async execute(
    member: GuildMember,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      if (!member?.guild) {
        console.error("Invalid member or guild in guildMemberRemove event");
        return;
      }

      const guild = member.guild;
      const guilds = await getGuild(guild.id);

      if (guilds) {
        if (guilds.goodbyeer?.enabled) {
          await goodbyeCard(member, guild, guilds, client).catch((err) => {
            console.error(
              `Failed to send goodbye card in guild ${guild.id}:`,
              err
            );
          });
        }

        if (guilds.goodbyeer?.enabled) {
          await addMemberGoodbye(guild).catch((err) => {
            console.error(
              `Failed to update goodbye stats for guild ${guild.id}:`,
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
      console.error("Critical error in guildMemberRemove:", err);
      error(err);
    }
  }
}
