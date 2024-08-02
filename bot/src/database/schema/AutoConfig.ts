// Autoconfig steps:
// 1. Select a module
// 2. Enable/Disable the module
// 3. Select a channel
// 4. Write a message
// 5. Enbale/Disable Image
//  5.1 Select a background
//  5.2. Write Text
//  5.3. Select Theme
//  5.4. Select Font
//  5.5. Select Size
//  5.6. Select Color
// 6. Enable/Disable Embed
//  6.1. Write title
//  6.2. Write description
//  6.3. Select Color
//  6.4. Write Footer
//  6.5. Select Footer Icon
//  6.6. Enable/Disable Timestamp
// 7. Enable/Disable Webhook
// 7.1. Write Webhook Name
// 7.2. Write Webhook Avatar
// 8. Enable/Disable DM
// 8.1. Write DM Message
// 8.2. Enable/Disable DM Image
// 8.3 Enable/Disable DM Embed
//  8.3.1. Write DM Embed Title
//  8.3.2. Write DM Embed Description
//  8.3.3. Select DM Embed Color
//  8.3.4. Write DM Embed Footer
//  8.3.5. Select DM Embed Footer Icon
//  8.3.6. Enable/Disable DM Embed Timestamp
// 9. Finish

import { model, Schema } from "mongoose";
import { Module } from "./Guild";

export interface AutoConfigType {
    guildId: string;
    step: number;
    module: string;
    options: Module;
}

const autoConfigSchema = new Schema<AutoConfigType>({
    guildId: {
        type: String,
        required: true,
    },
    step: {
        type: Number,
        required: true,
    },
    module: {
        type: String,
        required: false,
    },
    options: {
        enabled: {
            type: Boolean,
            required: false,
        },
        channel: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        image: {
            backgroundId: {
                type: String,
                required: false,
            },
            enabled: {
                type: Boolean,
                required: false,
            },
            text: {
                type: String,
                required: false,
            },
            theme: {
                type: String,
                required: false,
            },
            font: {
                type: String,
                required: false,
            },
            size: {
                type: Number,
                required: false,
            },
            color: {
                type: String,
                required: false,
            },
        },
        embed: {
            enabled: {
                type: Boolean,
                required: false,
            },
            title: {
                type: String,
                required: false,
            },
            description: {
                type: String,
                required: false,
            },
            color: {
                type: String,
                required: false,
            },
            footer: {
                enabled: {
                    type: Boolean,
                    required: false,
                },
                text: {
                    type: String,
                    required: false,
                },
                icon: {
                    type: String,
                    required: false,
                },
                timestamp: {
                    type: Boolean,
                    required: false,
                },
            },
        },
        webhook: {
            enabled: {
                type: Boolean,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            avatar: {
                type: String,
                required: false,
            },
        },
        dm: {
            enabled: {
                type: Boolean,
                required: false,
            },
            message: {
                type: String,
                required: false,
            },
            image: {
                enabled: {
                    type: Boolean,
                    required: false,
                },
                url: {
                    type: String,
                    required: false,
                },
            },
            embed: {
                enabled: {
                    type: Boolean,
                    required: false,
                },
                title: {
                    type: String,
                    required: false,
                },
                description: {
                    type: String,
                    required: false,
                },
                color: {
                    type: String,
                    required: false,
                },
                footer: {
                    enabled: {
                        type: Boolean,
                        required: false,
                    },
                    text: {
                        type: String,
                        required: false,
                    },
                    icon: {
                        type: String,
                        required: false,
                    },
                },
                timestamp: {
                    type: Boolean,
                    required: false,
                },
            },
        },
    },
})

export default model<AutoConfigType>('AutoConfig', autoConfigSchema);