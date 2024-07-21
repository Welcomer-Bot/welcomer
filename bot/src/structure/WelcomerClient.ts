import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { APIApplicationCommand, AttachmentBuilder, Client, Collection, GatewayIntentBits, Options, Partials } from "discord.js";
import { CommandType, EventType, modalType, SelectMenuType } from "../types";
import WelcomerClientType from "../types/WelcomerClientType";
import { connectMongo } from "../utils/database";
import { loadEvents } from "./handlers";

export default class WelcomerClient extends Client implements WelcomerClientType {
    public commands: Collection<string, CommandType>;
    public modals: Collection<string, modalType>;
    public buttons: Collection<string, any>;
    public events: Collection<string, EventType>;
    public selectMenus: Collection<string, SelectMenuType>;
    public commandsData: Collection<string, APIApplicationCommand>;
    public cluster: ClusterClient<this>;
    public admins: string[];
    public images: Collection<string, AttachmentBuilder>;

    constructor() {
        super({
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
            partials: [Partials.GuildMember],
            allowedMentions: {
                parse: ["roles", "users"],
                repliedUser: true,
            },
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
                MessageManager: 0,
                ReactionManager: 0,
                GuildMemberManager: {
                    maxSize: 1,
                    keepOverLimit: (member) => member.id === member.client.user.id,
                },
            }),
            sweepers: {
                ...Options.DefaultSweeperSettings,
                messages: {
                    interval: 900, // Every hour.
                    lifetime: 120, // Remove messages older than 30 minutes.
                },
                users: {
                    interval: 3_600, // Every hour.
                    filter: () => (user) => user.bot && user.id !== user.client.user.id, // Remove all bots.
                },
            },
        })
        this.commands = new Collection();
        this.modals = new Collection();
        this.buttons = new Collection();
        this.events = new Collection();
        this.selectMenus = new Collection();
        this.commandsData = new Collection();
        this.images = new Collection();

        this.cluster = new ClusterClient(this);
        this.admins = process.env.ADMINS?.split(",") || [];

        this.images.set("banner", new AttachmentBuilder("banner.png").setFile("assets/banner.png"))

    }

    startClient() {
        loadEvents(this);
        this
            .login(process.env.TOKEN)
            .then(() => {
                console.log("Client is starting")
                console.log(`Bot administators ids: ${this.admins}`)
                connectMongo()
            })
            .catch((err) => {
                console.error("An error occured while starting the bot", err)
            })
    }
}
