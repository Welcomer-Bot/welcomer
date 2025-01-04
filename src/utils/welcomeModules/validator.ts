import { z } from "zod";

export type ColorResolvable =
  | keyof typeof Colors
  | "Random"
  | readonly [red: number, green: number, blue: number]
  | number
  | HexColorString;

export type HexColorString = `#${string}`;

export const Colors = z.object({
  Default: z.literal(0x000000),
  White: z.literal(0xffffff),
  Aqua: z.literal(0x1abc9c),
  Green: z.literal(0x57f287),
  Blue: z.literal(0x3498db),
  Yellow: z.literal(0xfee75c),
  Purple: z.literal(0x9b59b6),
  LuminousVividPink: z.literal(0xe91e63),
  Fuchsia: z.literal(0xeb459e),
  Gold: z.literal(0xf1c40f),
  Orange: z.literal(0xe67e22),
  Red: z.literal(0xed4245),
  Grey: z.literal(0x95a5a6),
  Navy: z.literal(0x34495e),
  DarkAqua: z.literal(0x11806a),
  DarkGreen: z.literal(0x1f8b4c),
  DarkBlue: z.literal(0x206694),
  DarkPurple: z.literal(0x71368a),
  DarkVividPink: z.literal(0xad1457),
  DarkGold: z.literal(0xc27c0e),
  DarkOrange: z.literal(0xa84300),
  DarkRed: z.literal(0x992d22),
  DarkGrey: z.literal(0x979c9f),
  DarkerGrey: z.literal(0x7f8c8d),
  LightGrey: z.literal(0xbcc0c0),
  DarkNavy: z.literal(0x2c3e50),
  Blurple: z.literal(0x5865f2),
  Greyple: z.literal(0x99aab5),
  DarkButNotBlack: z.literal(0x2c2f33),
  NotQuiteBlack: z.literal(0x23272a),
});

export const MessageEmbedSchema = z.object({
  title: z
    .string()
    .optional()
    .nullable()
    .refine((value) => (value?.length || 0) <= 256, {
      message: "Embed title must be less than 256 characters.",
    }),
  description: z
    .string()
    .optional()
    .nullable()
    .refine((value) => (value?.length || 0) <= 4096, {
      message: "Embed description must be less than 4096 characters.",
    }),
  url: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) =>
        !value ||
        value.match(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/),
      { message: "Embed url must be a valid url." }
    ),
  color: z
    .union([
      z.string(),
      z.literal("Random"),
      z.tuple([z.number(), z.number(), z.number()]),
      z.number(),
      z.string().regex(/^#[0-9a-fA-F]{6}$/),
      z.enum(Object.keys(Colors) as [keyof typeof Colors]),
    ])
    .optional()
    .nullable()
    .refine(
      (value) =>
        typeof value === "number"
          ? (value || 0) >= 0 && (value || 0) <= 16777215
          : true,
      {
        message: "Embed color must be a valid color.",
      }
    ),
  author: z
    .object({
      name: z
        .string()
        .optional()
        .nullable()
        .refine((value) => (value?.length || 0) <= 256, {
          message: "Embed author name must be less than 256 characters.",
        }),
      url: z
        .string()
        .optional()
        .nullable()
        .refine(
          (value) =>
            !value ||
            value.match(
              /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/
            ),
          { message: "Embed author url must be a valid url." }
        ),
      icon_url: z
        .string()
        .optional()
        .nullable()
        .refine(
          (value) =>
            !value ||
            value.match(
              /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/
            ),
          { message: "Embed author icon url must be a valid url." }
        ),
    })
    .optional()
    .nullable()
    .refine(
      (value) => !value || (value?.name && (!value?.icon_url || !value?.url)),
      {
        message: "Embed author must have the name property set.",
      }
    ),
  thumbnail: z
    .object({
      url: z
        .string()
        .optional()
        .nullable()
        .refine(
          (value) =>
            !value ||
            value.match(
              /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/
            ),
          { message: "Embed thumbnail url must be a valid url." }
        ),
    })
    .optional()
    .nullable(),
  image: z
    .object({
      url: z
        .string()
        .optional()
        .nullable()
        .refine(
          (value) =>
            !value ||
            value.match(
              /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/
            ),
          { message: "Embed image url must be a valid url." }
        ),
    })
    .optional()
    .nullable(),
  footer: z
    .object({
      text: z
        .string()
        .optional()
        .nullable()
        .refine((value) => (value?.length || 0) <= 2048, {
          message: "Embed footer text must be less than 2048 characters.",
        }),
      icon_url: z
        .string()
        .optional()
        .nullable()
        .refine(
          (value) =>
            !value ||
            value.match(
              /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/
            ),
          { message: "Embed footer icon url must be a valid url." }
        ),
    })
    .optional()
    .nullable()
    .refine((value) => !value || (!value.icon_url && value.text), {
      message: "Embed footer must have the text property set.",
    }),
  fields: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Embed field name must be a valid string")
          .refine((value) => (value?.length || 0) <= 256, {
            message: "Embed field name must be less than 256 characters.",
          }),
        value: z
          .string()
          .min(1, "Embed field name must be a valid string")
          .refine((value) => (value?.length || 0) <= 1024, {
            message: "Embed field value must be less than 1024 characters.",
          }),
        inline: z.boolean().optional().nullable(),
      })
    )
    .optional()
    .nullable()
    .refine((value) => !value || value.length <= 25, {
      message: "Embed fields must be less than 25.",
    }),
});

export const MessageSchema = z
  .object({
    content: z
      .string()
      .optional()
      .nullable()
      .refine((value) => (value?.length || 0) <= 2000, {
        message: "Message content must be less than 2000 characters.",
      }),
    embeds: z
      .array(MessageEmbedSchema)
      .optional()
      .nullable()
      .refine((value) => !value || value.length <= 10, {
        message: "Message embeds must be less than 10.",
      }),
    files: z
      .array(
        z.object({
          attachment: z.string(),
          name: z.string(),
        })
      )
      .optional()
      .nullable()
      .refine((value) => !value || value.length <= 10, {
        message: "Message files must be less than 10.",
      }),
  })
  .refine(
    (value) => {
      // Check if at least one of content, embeds, or files is present and not empty
      const hasContent = value.content && value.content.trim().length > 0;
      const hasEmbeds = value.embeds && value.embeds.length > 0;
      const hasFiles = value.files && value.files.length > 0;
      return hasContent || hasEmbeds || hasFiles;
    },
    {
      message: "Message must have at least one of content, embeds, or files.",
    }
  )
  .refine(
    (value) =>
      (value.content?.length || 0) +
        (value.embeds
          ?.map(
            (embed) =>
              (embed.title?.length || 0) +
              (embed.description?.length || 0) +
              (embed.fields
                ?.map(
                  (field) =>
                    (field.name?.length || 0) + (field.value?.length || 0)
                )
                .reduce((acc, curr) => acc + curr, 0) || 0)
          )
          .reduce((acc, curr) => acc + curr, 0) || 0) <=
      6000,
    {
      message:
        "Message content, embeds and fields must be less than 6000 characters.",
    }
  );
