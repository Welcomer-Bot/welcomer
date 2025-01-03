import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";

import { getWelcomer } from "src/utils/database";
import { generateCard } from "../../utils/welcomeCard";
import { EventType } from "./../../types/index";

export default class GuildMemberAdd implements EventType {
  name: string = "guildMemberAdd";
  async execute(
    member: GuildMember,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      const module = await getWelcomer(member.guild.id);
      if (!module) return;
      generateCard(member, member.guild, module, client, null, "welcomer");
      // addMemberWelcomed(member.guild);
    } catch {
      // error(err);
    }
  }
}
