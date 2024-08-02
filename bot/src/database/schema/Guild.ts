import { ChannelType, APIAttachment, APIEmbed, Guild, ColorResolvable } from "discord.js";
import { model, Model, Schema } from "mongoose";
import { leaverkeywords, welcomeKeywords } from "../../utils/constants";
import { attachementSchema } from "./APISchemas/Attachment";
import { EmbedSchema, WelcomerEmbed } from "./APISchemas/Embed";
export interface GuildFormated {
    id: string;
    welcomer: Module;
    leaver: Module;
    mutual?: boolean;
    _tempData?: Guild
    _id?: string;
    imageGallery?: imageGallery[]
}

export interface Module {
    enabled: boolean;
    channel: string | null;
    message: string;
    dm?: DmModule;
    embeds: WelcomerEmbed[];
    attachements: APIAttachment[];
    webhook: WebhookModule;
};

export interface ImageModule {
    enabled: boolean;
    backgroundId: string;
    theme: string;
    text: string;
    color: string;
    font: string;
    fontSize: number;

};

export interface EmbedModule {
    title: string;
    description: string;
    url: string;
    color: ColorResolvable;
    image: ImageEmbedModule;
    footer: EmbedModuleFooter;
    thumbnail: string;
    timestamp: boolean;
};

export interface ImageEmbedModule {
    enabled: boolean;
    isGeneratedImage: boolean;
    image: string;
}

export interface EmbedModuleFooter {
    enabled: boolean;
    text: string;
    icon: string;
};

export interface WebhookModule {
    enabled: boolean;
    id: string;
    name: string;
    avatar: string;
};

export interface DmModule {
    enabled: boolean;
    message: string;
    embeds: APIEmbed[];
    attachements: APIAttachment[];

};
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
        message: {
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
                    `The array exceeds the limit of 20 elements. Current length: ${props.value.length}`,
            },
        },
        attachements: {
            type: [attachementSchema],
            validate: {
                validator: function (value: any[]) {
                    return value.length <= 10;
                },
                message: (props) =>
                    `The array exceeds the limit of 10  elements. Current length: ${props.value.length}`,
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
            message: {
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
            attachements: {
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
        message: {
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
        attachements: {
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
    _tempData: {
        type: Schema.Types.Mixed,
        select: false,
    },
});

GuildSchema.pre("save", function (next) {
    if (this._tempData) {
        let guild = this._tempData;
        const matchingWelcomeChannel =
            guild.systemChannel ??
            guild.channels.cache.find(
                (channel) =>
                    channel.type === ChannelType.GuildText &&
                    welcomeKeywords.some((keyword) =>
                        channel.name.toLowerCase().includes(keyword)
                    )
            );
        const matchingGoodbyeChannel =
            guild.systemChannel ??
            guild.channels.cache.find(
                (channel) =>
                    channel.type === ChannelType.GuildText &&
                    leaverkeywords.some((keyword) =>
                        channel.name.toLowerCase().includes(keyword)
                    )
            );

        this.welcomer.channel = matchingWelcomeChannel
            ? matchingWelcomeChannel.id
            : null;
        this.welcomer.enabled = matchingWelcomeChannel ? true : false;
        this.leaver.channel = matchingGoodbyeChannel
            ? matchingGoodbyeChannel.id
            : null;
        this.leaver.enabled = matchingGoodbyeChannel ? true : false;
    }
    this._tempData = undefined;
    delete this._tempData;
    next();
});

export default model("Guild", GuildSchema);
