import * as z from "zod"
import { CompleteLeaver, RelatedLeaverModel, CompleteWelcomer, RelatedWelcomerModel } from "./index"

export const GuildModel = z.object({
  id: z.string(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
})

export interface CompleteGuild extends z.infer<typeof GuildModel> {
  leaver?: CompleteLeaver | null
  welcomer?: CompleteWelcomer | null
}

/**
 * RelatedGuildModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGuildModel: z.ZodSchema<CompleteGuild> = z.lazy(() => GuildModel.extend({
  leaver: RelatedLeaverModel.nullish(),
  welcomer: RelatedWelcomerModel.nullish(),
}))
