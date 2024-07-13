import { Schema, model } from "mongoose";
import { Module } from "../../types/types";

export interface editConfigType{
    interactionId: string;
    requesterId: string;
    guildId: string;
    module: string;
    options: Module
    expireAt: Date
}

let editConfigSchema = new Schema<editConfigType>(
    {
        interactionId: {
            type: String,
            required: true,
        },
        requesterId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        guildToEdit: {
            type: String,
            required: false,
        },
        module: {
            type: String,
            required: true,
        },
        options: {
            enabled: {
                type: Boolean,
                required: false,
            },
            dmEnabled: {
                type: Boolean,
                required: false,
            },
            channel: {
                type: String,
                required: false,
                default: null,
            },
            message: {
                type: String,
                required: false,
            },
            dmMessage: {
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
                        default: false,
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
                thumbnail: {
                    type: String,
                    required: false,
                },
            },
            webhook: {
                enabled: {
                    type: Boolean,
                    required: false,
                },
                id: {
                    type: String,
                    required: false,
                },
                name: {
                    type: String,
                    required: false,
                    maxLength: 80,
                },
                avatar: {
                    type: String,
                    required: false,
                },
            },
        },
        expireAt: {
            type: Date,
            default: Date.now() + 1000 * 60 * 60 * 24,
        },
    },
    { timestamps: true },
);

module.exports = model("editConfig", editConfigSchema);
