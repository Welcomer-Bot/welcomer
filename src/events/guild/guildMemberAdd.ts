import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../models/Client";

import { generateCard } from "../../utils/welcomeCard";
import { EventType } from "./../../types/index";

export default class GuildMemberAdd implements EventType {
  name: string = "guildMemberAdd";
  async execute(
    member: GuildMember,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      const source = await client.db.getSource(member.guild.id, "Welcomer");
      if (!source) return;
      generateCard(member, member.guild, source, client, null, "Welcomer");
    } catch (error) {
      console.error(error);
    }
  }
}
