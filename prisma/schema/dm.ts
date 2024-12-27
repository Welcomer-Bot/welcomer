import * as z from "zod"
import { CompleteWelcomer, RelatedWelcomerModel, CompleteEmbed, RelatedEmbedModel } from "./index"

export const DMModel = z.object({
  id: z.number().int(),
  moduleId: z.number().int(),
  message: z.string(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteDM extends z.infer<typeof DMModel> {
  module: CompleteWelcomer
  embeds: CompleteEmbed[]
}

/**
 * RelatedDMModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDMModel: z.ZodSchema<CompleteDM> = z.lazy(() => DMModel.extend({
  module: RelatedWelcomerModel,
  embeds: RelatedEmbedModel.array(),
}))
