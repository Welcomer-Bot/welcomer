import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";

import { generateCard } from "./../../utils/welcomeCard";

import { getLeaver } from "src/utils/database";
import { EventType } from "./../../types/index";

export default class GuildMemberRemove implements EventType {
  name: string = "guildMemberRemove";
  async execute(
    member: GuildMember,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      const guild = member.guild;
      const module = await getLeaver(guild.id);
      if (!module) return;
      generateCard(member, guild, module, client, null, "leaver");
      // addMemberGoodbye(guild);
    } catch (err: Error | unknown) {
      client.logger.error(err as Error);
    }
  }
}
