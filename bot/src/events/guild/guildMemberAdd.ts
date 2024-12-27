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
      var guild = member.guild;
      var guilds = await getGuild(guild.id);
      if (guilds) {
        welcomeCard(member, guild, guilds, client);
        if (!guilds.welcomer.enabled) return;
        addMemberWelcomed(guild);
      } else {
        await createOrUpdateGuild(member.guild);
      }
    } catch (err: Error | any) {
      error(err);
    }
  }
}