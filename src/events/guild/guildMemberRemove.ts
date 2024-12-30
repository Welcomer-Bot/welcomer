import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";

import { goodbyeCard } from "./../../utils/welcomeCard";

import { getLeaver } from "src/utils/database";
import { error } from "../../utils/logger";
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
      goodbyeCard(member, guild, module, client);
      // addMemberGoodbye(guild);
    } catch (err: Error | unknown) {
      error(err as Error);
    }
  }
}
