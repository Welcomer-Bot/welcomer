import * as z from "zod"
import { CompleteDM, RelatedDMModel, CompleteEmbed, RelatedEmbedModel, CompleteGuild, RelatedGuildModel } from "./index"

export const WelcomerModel = z.object({
  id: z.number().int().optional(),
  guildId: z.string(),
  channelId: z.string().nullish(),
  content: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteWelcomer extends z.infer<typeof WelcomerModel> {
  DM?: CompleteDM | null
  embeds: CompleteEmbed[]
  guild: CompleteGuild
}

/**
 * RelatedWelcomerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedWelcomerModel: z.ZodSchema<CompleteWelcomer> = z.lazy(() => WelcomerModel.extend({
  DM: RelatedDMModel.nullish(),
  embeds: RelatedEmbedModel.array(),
  guild: RelatedGuildModel,
}))
