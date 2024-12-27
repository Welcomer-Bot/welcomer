import * as z from "zod"
import { CompleteEmbed, RelatedEmbedModel } from "./index"

export const EmbedImageModel = z.object({
  id: z.number().int(),
  embedId: z.number().int(),
  url: z.string(),
  width: z.number().int().nullish(),
  heigth: z.number().int().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteEmbedImage extends z.infer<typeof EmbedImageModel> {
  embed: CompleteEmbed
}

/**
 * RelatedEmbedImageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedImageModel: z.ZodSchema<CompleteEmbedImage> = z.lazy(() => EmbedImageModel.extend({
  embed: RelatedEmbedModel,
}))
