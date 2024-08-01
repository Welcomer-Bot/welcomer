import { APIEmbed } from 'discord.js';
import { Schema } from "mongoose";

export const EmbedSchema = new Schema<APIEmbed>({
    title: {
        type: String,
        maxlength: 256,
    },
    description: {
        type: String,
        maxlength: 2048,
    },
    url: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: "#000000",
        validate: {
            validator: function (value: string) {
                const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
                const namedColors = ["RANDOM", "DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "YELLOW", "PURPLE", "LUMINOUS_VIVID_PINK", "GOLD", "ORANGE", "RED", "GREY", "DARKER_GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_GOLD", "DARK_ORANGE", "DARK_RED", "DARK_GREY", "LIGHT_GREY", "DARK_NAVY", "BLURPLE", "GREYPLE", "DARK_BUT_NOT_BLACK", "NOT_QUITE_BLACK"];
                return hexColorRegex.test(value) || namedColors.includes(value.toUpperCase());
            },
            message: props => `${props.value} is not a valid color!`
        },
    },
    footer: {
        text: {
            type: String,
            default: null,
            maxlength: 2048,
        },
        icon: {
            type: String,
            default: null,
        },
    },
    image: {
        url: {
            type: String,
            default: null,
        },
        isGeneratedImage: {
            type: Boolean,
            default: true,
        },
        height: {
            type: Number,
            default: null,
        },
        width: {
            type: Number,
            default: null,
        },
    },
    thumbnail: {
        url: {
            type: String,
            default: null,
        },
        height: {
            type: Number,
            default: null,
        },
        width: {
            type: Number,
            default: null,
        },
    },
    author: {
        name: {
            type: String,
            default: null,
        },
        url: {
            type: String,
            default: null,
        },
        icon: {
            type: String,
            default: null,
        },
    },
    fields: [{
        name: {
            type: String,
            maxlength: 256,
        },
        value: {
            type: String,
            maxlength: 1024,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    }]


})
