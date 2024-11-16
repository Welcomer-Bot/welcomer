import { BaseMessageOptions, ChannelType, Guild } from "discord.js";
import { model, Model, Schema } from "mongoose";
import { leaverkeywords, welcomeKeywords } from "../../utils/constants";
import { attachementSchema } from "./APISchemas/Attachment";
import { EmbedSchema } from "./APISchemas/Embed";

export interface Module extends BaseMessageOptions {
    enabled: boolean;
    channel: string | null;
    dm?: DmModule;
    webhook: WebhookModule;

};
export interface GuildFormated {
    id: string;
    name: string;
    welcomer: Module;
    goodbyer: Module;
    mutual?: boolean;
    _tempData?: Guild
    _id?: string;
    imageGallery?: imageGallery[]
}


export interface ImageModule {
    enabled: boolean;
    backgroundId: string;
    theme: string;
    text: string;
    color: string;
    font: string;
    fontSize: number;

};

export interface WebhookModule {
    enabled: boolean;
    id: string;
    name: string;
    avatar: string;
};

export interface DmModule extends BaseMessageOptions {
    enabled: boolean;
};
export interface imageGallery {
    id: string;
    url: string;
    name: string;
}
