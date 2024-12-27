import * as z from "zod"
import { CompleteChannels, RelatedChannelsModel, CompleteUser, RelatedUserModel } from "./index"

export const UserGuildModel = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullish(),
  banner: z.string().nullish(),
  permissions: z.string().nullish(),
  userId: z.string(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteUserGuild extends z.infer<typeof UserGuildModel> {
  channels: CompleteChannels[]
  user: CompleteUser
}

/**
 * RelatedUserGuildModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserGuildModel: z.ZodSchema<CompleteUserGuild> = z.lazy(() => UserGuildModel.extend({
  channels: RelatedChannelsModel.array(),
  user: RelatedUserModel,
}))
