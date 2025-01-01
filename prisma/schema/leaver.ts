import * as z from "zod"
import { CompleteEmbed, RelatedEmbedModel, CompleteGuild, RelatedGuildModel } from "./index"

export const LeaverModel = z.object({
  id: z.number().int().optional(),
  guildId: z.string(),
  channelId: z.string().nullish(),
  content: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteLeaver extends z.infer<typeof LeaverModel> {
  embeds: CompleteEmbed[]
  guild: CompleteGuild
}

/**
 * RelatedLeaverModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLeaverModel: z.ZodSchema<CompleteLeaver> = z.lazy(() => LeaverModel.extend({
  embeds: RelatedEmbedModel.array(),
  guild: RelatedGuildModel,
}))
