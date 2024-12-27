import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { createOrUpdateGuild } from "../../utils/createGuild";
import { addMemberWelcomed, getGuild } from "../../utils/getGuild";
import { welcomeCard } from "../../utils/welcomeCard";
import { EventType } from "./../../types/index";

export default class GuildMemberAdd implements EventType {
  name: string = "guildMemberAdd";
  async execute(
    member: GuildMember,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      const guild = member.guild;
      const guildDb = await getGuild(guild.id);
      if (guildDb) {
        welcomeCard(member, guild, guildDb, client);
        if (!guildDb.welcomer) return;
        addMemberWelcomed(guild);
      } else {
        await createOrUpdateGuild(member.guild);
      }
    } catch {
      // error(err);
    }
  }
}
