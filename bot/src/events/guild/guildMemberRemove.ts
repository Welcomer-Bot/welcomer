import { goodbyeCard } from './../../utils/welcomeCard';
import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { createOrUpdateGuild } from "../../utils/createGuild";
import { addMemberGoodbye, getGuild } from "../../utils/getGuild";

import { EventType } from "./../../types/index";
import { error } from '../../utils/logger';

export default class GuildMemberAdd implements EventType {
  name: string = "guildMemberRemove";
  async execute(
    member: GuildMember,
    client: WelcomerClient
  ): Promise<void | InteractionResponse<boolean> | Message<boolean>> {
    try {
      var guild = member.guild;
      var guilds = await getGuild(guild.id);
      if (guilds) {
        goodbyeCard(member, guild, guilds, client);
        if (!guilds.goodbyeer.enabled) return;
        addMemberGoodbye(guild);
      } else {
        await createOrUpdateGuild(member.guild);
      }
    } catch (err:Error | any) {
      error(err);
    }
  }
}

