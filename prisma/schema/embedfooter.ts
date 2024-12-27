import * as z from "zod"
import { CompleteEmbed, RelatedEmbedModel } from "./index"

export const EmbedFooterModel = z.object({
  id: z.number().int().optional(),
  embedId: z.number().int().optional().nullish(),
  text: z.string().nullish(),
  iconUrl: z.string().nullish(),
  createdAt: z.date().optional().nullish(),
  updatedAt: z.date().optional().nullish(),
})

export interface CompleteEmbedFooter extends z.infer<typeof EmbedFooterModel> {
  embed?: CompleteEmbed | null
}

/**
 * RelatedEmbedFooterModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedFooterModel: z.ZodSchema<CompleteEmbedFooter> = z.lazy(() => EmbedFooterModel.extend({
  embed: RelatedEmbedModel.optional().nullish(),
}))
