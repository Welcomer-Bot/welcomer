import * as z from "zod"
import { CompleteUserGuild, RelatedUserGuildModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  username: z.string().nullish(),
  discriminator: z.string().nullish(),
  avatar: z.string().nullish(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  guilds: CompleteUserGuild[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  guilds: RelatedUserGuildModel.array(),
}))
