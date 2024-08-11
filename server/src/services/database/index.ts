import Guild, { GuildFormated } from "../../database/schemas/Guild";

export async function fetchGuild(id: String) {
  try {
    return await Guild.findOne<GuildFormated>({ id });
  } catch (error) {
    return null;
  }
}
