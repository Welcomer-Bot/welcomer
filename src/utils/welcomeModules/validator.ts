import { z } from 'zod';

export const MessageEmbedSchema = z.object({
    title: z.string().optional().nullable().refine((value) => (value?.length || 0) <= 256, { message: 'Embed title must be less than 256 characters.' }),
    description: z.string().optional().nullable().refine((value) => (value?.length || 0) <= 2048, { message: 'Embed description must be less than 2048 characters.' }),
    url: z.string().optional().nullable().refine((value) => !value || value.match(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/), { message: 'Embed url must be a valid url.' }),
    color: z.number().optional().nullable().refine((value) => (value || 0) >= 0 && (value || 0) <= 16777215, { message: 'Embed color must be a valid color.' }),
    author: z.object({
        name: z.string().optional().nullable().refine((value) => (value?.length || 0) <= 256, { message: 'Embed author name must be less than 256 characters.' }),
        url: z.string().optional().nullable().refine((value) => !value || value.match(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/), { message: 'Embed author url must be a valid url.' }),
        icon_url: z.string().optional().nullable().refine((value) => !value || value.match(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/), { message: 'Embed author icon url must be a valid url.' }),
    }).optional().nullable().refine((value) => !value || Object.keys(value).length > 0, { message: 'Embed author must have at least one property.' }),
    thumbnail: z.object({
        url: z.string().optional().nullable().refine((value) => !value || value.match(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/), { message: 'Embed thumbnail url must be a valid url.' }),
    }).optional().nullable(),
    image: z.object({
        url: z.string().optional().nullable().refine((value) => !value || value.match(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/), { message: 'Embed image url must be a valid url.' }),
    }).optional().nullable(),
    footer: z.object({
        text: z.string().optional().nullable().refine((value) => (value?.length || 0) <= 2048, { message: 'Embed footer text must be less than 2048 characters.' }),
        icon_url: z.string().optional().nullable().refine((value) => !value || value.match(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/), { message: 'Embed footer icon url must be a valid url.' }),
    }).optional().nullable().refine((value) => !value || Object.keys(value).length > 0, { message: 'Embed footer must have at least one property.' }),
    fields: z.array(z.object({
        name: z.string().optional().nullable().refine((value) => (value?.length || 0) <= 256, { message: 'Embed field name must be less than 256 characters.' }),
        value: z.string().optional().nullable().refine((value) => (value?.length || 0) <= 1024, { message: 'Embed field value must be less than 1024 characters.' }),
        inline: z.boolean().optional().nullable(),
    })).optional().nullable().refine((value) => !value || value.length <= 25, { message: 'Embed fields must be less than 25.' }), 
});

export const MessageSchema = z.object({
    content: z.string().optional().nullable().refine((value) => (value?.length || 0) <= 2000, { message: 'Message content must be less than 2000 characters.' }),
    embeds: z.array(MessageEmbedSchema).optional().nullable().refine((value) => !value || value.length <= 10, { message: 'Message embeds must be less than 10.' }),
    files: z.array(z.object({
        attachment: z.string(),
        name: z.string(),
    })).optional().nullable().refine((value) => !value || value.length <= 10, { message: 'Message files must be less than 10.' }),
});