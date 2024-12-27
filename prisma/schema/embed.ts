import * as z from "zod"
import { CompleteEmbedFooter, RelatedEmbedFooterModel, CompleteEmbedField, RelatedEmbedFieldModel, CompleteEmbedAuthor, RelatedEmbedAuthorModel, CompleteEmbedImage, RelatedEmbedImageModel, CompleteWelcomer, RelatedWelcomerModel, CompleteLeaver, RelatedLeaverModel, CompleteDM, RelatedDMModel } from "./index"

export const EmbedModel = z.object({
  id: z.number().int().optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  color: z.string().nullish(),
  timestamp: z.date().nullish(),
  timestampNow: z.boolean().nullish(),
  thumbnail: z.string().nullish(),
  url: z.string().nullish(),
  created: z.date().optional().nullish(),
  updated: z.date().optional().nullish(),
  welcomerId: z.number().int().nullish(),
  leaverId: z.number().int().nullish(),
  DMId: z.number().int().nullish(),
})

export interface CompleteEmbed extends z.infer<typeof EmbedModel> {
  footer?: CompleteEmbedFooter | null
  fields: CompleteEmbedField[]
  author?: CompleteEmbedAuthor | null
  image?: CompleteEmbedImage | null
  welcomer?: CompleteWelcomer | null
  leaver?: CompleteLeaver | null
  DM?: CompleteDM | null
}

/**
 * RelatedEmbedModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedModel: z.ZodSchema<CompleteEmbed> = z.lazy(() => EmbedModel.extend({
  footer: RelatedEmbedFooterModel.nullish(),
  fields: RelatedEmbedFieldModel.array(),
  author: RelatedEmbedAuthorModel.nullish(),
  image: RelatedEmbedImageModel.nullish(),
  welcomer: RelatedWelcomerModel.nullish(),
  leaver: RelatedLeaverModel.nullish(),
  DM: RelatedDMModel.nullish(),
}))
