import { ChannelType } from "discord.js";
import { Schema, SchemaTypes, model } from "mongoose";
import { GuildFormated } from "../../types";
import { leaverkeywords, welcomeKeywords } from "../../utils/constants";


const GuildSchema = new Schema<GuildFormated>({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
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
        dm: {
            enabled: {
                type: Boolean,
                default: false,
            },
            message: {
                type: String,
                default: "Welcome {member} to {server}!",
                maxlength: 2000,
            },
            image: {
                enabled: {
                    type: Boolean,
                    default: false,
                },
                url: {
                    type: String,
                    default: null,
                },
            },
            embed: {
                enabled: {
                    type: Boolean,
                    default: false,
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
                timestamp: {
                    type: Boolean,
                    default: true,
                },
            },
            channel: {
                type: String,
                default: null,
            },
        },
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
        select: false
    },
});

GuildSchema.pre("save", function (next) {
    if (this._tempData) {

        let guild = this._tempData;
        const matchingWelcomeChannel = guild.systemChannel ?? guild.channels.cache.find(channel =>
            channel.type === ChannelType.GuildText && welcomeKeywords.some(keyword => channel.name.toLowerCase().includes(keyword))
        );
        const matchingGoodbyeChannel = guild.systemChannel ?? guild.channels.cache.find(channel =>
            channel.type === ChannelType.GuildText && leaverkeywords.some(keyword => channel.name.toLowerCase().includes(keyword))
        );

        this.welcomer.channel = matchingWelcomeChannel ? matchingWelcomeChannel.id : null
        this.welcomer.enabled = matchingWelcomeChannel ? true : false
        this.leaver.channel = matchingGoodbyeChannel ? matchingGoodbyeChannel.id : null
        this.leaver.enabled = matchingGoodbyeChannel ? true : false
    }
    this._tempData = undefined;
    delete this._tempData;
    next();
});


export default model("guilds", GuildSchema);