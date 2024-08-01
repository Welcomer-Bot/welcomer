import { APIAttachment } from "discord.js";
import { Schema } from "mongoose";



export const attachementSchema = new Schema<APIAttachment>({
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
})
