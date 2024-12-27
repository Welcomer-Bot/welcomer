import * as z from "zod"
import { CompleteUserGuild, RelatedUserGuildModel } from "./index"

export const ChannelsModel = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteChannels extends z.infer<typeof ChannelsModel> {
  guild: CompleteUserGuild
}

/**
 * RelatedChannelsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedChannelsModel: z.ZodSchema<CompleteChannels> = z.lazy(() => ChannelsModel.extend({
  guild: RelatedUserGuildModel,
}))
