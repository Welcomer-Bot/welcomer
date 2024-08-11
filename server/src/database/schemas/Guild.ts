import { Schema, SchemaTypes, model, Model } from "mongoose";
import { Channel, Member, Role } from "../../utils/types";
import { BaseMessageOptions } from "discord.js"
import { EmbedSchema } from "./APISchemas/Embed";
import { attachementSchema } from "./APISchemas/Attachment";

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
  channels: Channel[];
  roles: Role[];
  members: Member[];
}

export interface WebhookModule {
  enabled: boolean;
  id: string;
  name: string;
  avatar: string;
};

export interface DmModule extends BaseMessageOptions {
  enabled: boolean;
};

export interface Module extends BaseMessageOptions {
  enabled: boolean;
  channel: string | null;
  dm?: DmModule;
  webhook: WebhookModule;

};

export interface GuildFormated {
  id: string;
  welcomer: Module;
  leaver: Module;
  mutual?: boolean;
  imageGallery? : imageGallery[]
}

export interface imageGallery {
    id: string;
    url: string;
    name: string;
}
const GuildSchema = new Schema<GuildFormated, Model<GuildFormated>>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    welcomer: {
        enabled: {
            type: Boolean,
            default: false,
        },
        channel: {
            type: String,
            default: null,
        },
        content: {
            type: String,
            default: "Welcome to the server",
            maxlength: 2000,
        },
        embeds: {
            type: [EmbedSchema],
            validate: {
                validator: function (value: any[]) {
                    return value.length <= 20;
                },
                message: (props) =>
                    `The array exceeds the limit of 20 embeds. Current length: ${props.value.length}`,
            },
        },
        files: {
            type: [attachementSchema],
            validate: {
                validator: function (value: any[]) {
                    return value.length <= 10;
                },
                message: (props) =>
                    `The array exceeds the limit of 10 files. Current length: ${props.value.length}`,
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
                maxlength: 80,
            },
            avatar: {
                type: String,
                default: null,
            },
        },
        dm: {
            enabled: {
                type: Boolean,
                default: false,
            },
            content: {
                type: String,
                maxlength: 2000,
            },
            embeds: {
                type: [EmbedSchema],
                validate: {
                    validator: function (value: any[]) {
                        return value.length <= 20;
                    },
                    message: (props) =>
                        `The array exceeds the limit of 20 elements. Current length: ${props.value.length}`,
                },
            },
            files: {
                type: [attachementSchema],
                validate: {
                    validator: function (value: any[]) {
                        return value.length <= 10;
                    },
                    message: (props) =>
                        `The array exceeds the limit of 10  elements. Current length: ${props.value.length}`,
                },
            },
        },
        image: {
            enabled: {
                type: Boolean,
                default: false,
            },
            backgroundId: {
                type: String,
                default: null,
            },
            theme: {
                type: String,
                default: "default",
            },
            text: {
                type: String,
                default: "Welcome to the server",
            },
            color: {
                type: String,
                default: "#ffffff",
            },
            font: {
                type: String,
                default: "Arial",
            },
            fontSize: {
                type: Number,
                default: 50,
            }
        },
    },
    leaver: {
        enabled: {
            type: Boolean,
            default: false,
        },
        channel: {
            type: String,
            default: null,
        },
        content: {
            type: String,
            maxlength: 2000,
        },
        embeds: {
            type: [EmbedSchema],
            validate: {
                validator: function (value: any[]) {
                    return value.length <= 20;
                },
                message: (props) =>
                    `The array exceeds the limit of 20 elements. Current length: ${props.value.length}`,
            },
        },
        files: {
            type: [attachementSchema],
            validate: {
                validator: function (value: any[]) {
                    return value.length <= 10;
                },
                message: (props) =>
                    `The array exceeds the limit of 10  elements. Current length: ${props.value.length}`,
            },
        },
        image: {
            enabled: {
                type: Boolean,
                default: false,
            },
            backgroundId: {
                type: String,
                default: null,
            },
            theme: {
                type: String,
                default: "default",
            },
            text: {
                type: String,
                default: "Welcome to the server",
            },
            color: {
                type: String,
                default: "#ffffff",
            },
            font: {
                type: String,
                default: "Arial",
            },
            fontSize: {
                type: Number,
                default: 50,
            }
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
    },
    imageGallery: [
        {
            id: Number,
            name: String,
            url: String,
        },
    ],
});


export default model("Guild", GuildSchema);