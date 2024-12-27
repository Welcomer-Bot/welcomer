import { GuildMember, InteractionResponse, Message } from "discord.js";
import WelcomerClient from "../../structure/WelcomerClient";
import { createOrUpdateGuild } from "../../utils/createGuild";
import { addMemberGoodbye, getGuild } from "../../utils/getGuild";
import { goodbyeCard } from './../../utils/welcomeCard';

import { error } from '../../utils/logger';
import { EventType } from "./../../types/index";

export default class GuildMemberRemove implements EventType {
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
        console.log(guilds);
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

