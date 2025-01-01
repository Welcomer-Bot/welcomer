import * as z from "zod"
import { CompleteDM, RelatedDMModel, CompleteLeaver, RelatedLeaverModel, CompleteWelcomer, RelatedWelcomerModel, CompleteEmbedAuthor, RelatedEmbedAuthorModel, CompleteEmbedField, RelatedEmbedFieldModel, CompleteEmbedFooter, RelatedEmbedFooterModel, CompleteEmbedImage, RelatedEmbedImageModel } from "./index"

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
  DM?: CompleteDM | null
  leaver?: CompleteLeaver | null
  welcomer?: CompleteWelcomer | null
  author?: CompleteEmbedAuthor | null
  fields?: CompleteEmbedField | null
  footer?: CompleteEmbedFooter | null
  image?: CompleteEmbedImage | null
}

/**
 * RelatedEmbedModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedModel: z.ZodSchema<CompleteEmbed> = z.lazy(() => EmbedModel.extend({
  DM: RelatedDMModel.nullish(),
  leaver: RelatedLeaverModel.nullish(),
  welcomer: RelatedWelcomerModel.nullish(),
  author: RelatedEmbedAuthorModel.nullish(),
  fields: RelatedEmbedFieldModel.nullish(),
  footer: RelatedEmbedFooterModel.nullish(),
  image: RelatedEmbedImageModel.nullish(),
}))
