import { Schema, SchemaTypes, model } from "mongoose";
import { GuildFormated } from "../../types/types";







const GuildSchema = new Schema<GuildFormated>({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    icon: {
        type: SchemaTypes.String,
        required: true,
    },
    welcomer: {
        embed: {
            enabled: {
                type: Boolean,
                default: true,
            },
            title: {
                type: String,
                default: "Welcome {member} to {server}!",
                maxlength: 256,
            },
            description: {
                type: String,
                default: "You are the {count} member to join!",
                maxlength: 2048,
            },
            color: {
                type: Number || String,
                default: 0,
            },
            footer: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
                text: {
                    type: String,
                    default: "{member} joined at {joinedAt}",
                    maxlength: 2014,
                },
                icon: {
                    type: String,
                    default: null,
                    maxlength: 2048,
                },
            },
            thumbnail: {
                type: String,
                default: null,
            },
        },
        webhook: {
            enabled: {
                type: Boolean,
                default: false,
            },
            id: {
                type: String,
                default: null,
            },
            name: {
                type: String,
                default: "Welcomer",
                maxlength: 80,
            },
            avatar: {
                type: String,
                default: null,
            },
        },
        enabled: {
            type: Boolean,
            default: false,
        },
        dmEnabled: {
            type: Boolean,
            default: false,
        },
        channel: {
            type: String,
            default: null,
        },
        message: {
            type: String,
            default: "Welcome {member} to {server}!",
            maxlength: 2000,
        },
        dmMessage: {
            type: String,
            default: "Welcome {member} to {server}!",
            maxlength: 2000,
        },
        image: {
            backgroundId: {
                type: Number,
                default: null,
            },
            enabled: {
                type: Boolean,
                default: false,
            },
            theme: {
                type: String,
                default: "default",
            },
        },
        // end of image
    },
    leaver: {
        embed: {
            enabled: {
                type: Boolean,
                default: true,
            },
            title: {
                type: String,
                default: "{member} left {server}!",
            },
            description: {
                type: String,
                default: "We are now {count} members!",
            },
            color: {
                type: String,
                default: null,
            },
            footer: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
                text: {
                    type: String,
                    default: "{member} left at {time}",
                },
                icon: {
                    type: String,
                    default: null,
                },
            },
            thumbnail: {
                type: String,
                default: null,
            },
        },
        webhook: {
            enabled: {
                type: Boolean,
                default: false,
            },
            id: {
                type: String,
                default: null,
            },
            name: {
                type: String,
                default: null,
            },
            avatar: {
                type: String,
                default: null,
            },
        },
        enabled: {
            type: Boolean,
            default: false,
        },
        channel: {
            type: String,
            default: null,
        },
        message: {
            type: String,
            default: "{member} left {server}!",
            maxlength: 2000,
        },
        image: {
            backgroundId: {
                type: Number,
                default: null,
            },
            enabled: {
                type: Boolean,
                default: false,
            },
            theme: {
                type: String,
                default: "default",
            },
        }, // end of leaver module
        imageGallery: [
            {
                id: Number,
                name: String,
                url: String,
            },
        ],
    },
});

export default model("guilds", GuildSchema);