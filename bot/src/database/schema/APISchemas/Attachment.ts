import { APIAttachment } from "discord.js";
import { Schema } from "mongoose";



export const attachementSchema = new Schema<APIAttachment>({
    url: {
        type: String,
        required: true
    },
    proxy_url: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    }
})
