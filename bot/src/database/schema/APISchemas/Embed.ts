import { APIEmbed, ColorResolvable } from 'discord.js';
import { Schema } from "mongoose";

export interface WelcomerEmbed {
    title: string;
    description: string;
    url: string;
    color: ColorResolvable;
    footer: {
        text: string;
        icon_url: string;
    };
    image: {
        url: string;
        isGeneratedImage: boolean;
    };
    timestamp: boolean;
    thumbnail: {
        url: string;
    };
    author: {
        name: string;
        url: string;
        icon_url: string;
    };
    fields: {
        name: string;
        value: string;
        inline: boolean;
    }[];
}

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
    },
    color: {
        type: Number,
        validate: {
            validator: function (value: number) {
                const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
                const namedColors = ["RANDOM", "DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "YELLOW", "PURPLE", "LUMINOUS_VIVID_PINK", "GOLD", "ORANGE", "RED", "GREY", "DARKER_GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_GOLD", "DARK_ORANGE", "DARK_RED", "DARK_GREY", "LIGHT_GREY", "DARK_NAVY", "BLURPLE", "GREYPLE", "DARK_BUT_NOT_BLACK", "NOT_QUITE_BLACK"];
                return hexColorRegex.test(value.toString()) || namedColors.includes(value.toString().toUpperCase());
            },
            message: props => `${props.value} is not a valid color!`
        },
    },
    footer: {
        text: {
            type: String,
            maxlength: 2048,
        },
        icon_url: {
            type: String,
        },

    },
    image: {
        url: {
            type: String,
        },
        isGeneratedImage: {
            type: Boolean,
            default: true,
        },
    },
    timestamp: {
        type: String, 
    },

    thumbnail: {
        url: {
            type: String,
        },
    },
    author: {
        name: {
            type: String,
        },
        url: {
            type: String,
        },
        icon_url: {
            type: String,
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
        },
    }]


})
