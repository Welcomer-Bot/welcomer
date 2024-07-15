import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { Client, Collection, GatewayIntentBits, Options, Partials, APIApplicationCommand } from "discord.js";
import { CommandType, EventType, modalType, SelectMenuType } from "../types/types";
import { connectMongo } from "../utils/database";
import { loadEvents } from "./handlers";
import WelcomerClientType from "../types/WelcomerClientType";

export default class WelcomerClient  extends Client implements WelcomerClientType {
    public commands: Collection<string, CommandType>;
    public modals: Collection<string, modalType>;
    public buttons: Collection<string, any>;
    public events: Collection<string, EventType>;
    public selectMenus: Collection<string, SelectMenuType>;
    public commandsData: Collection<string, APIApplicationCommand>;
    public cluster: ClusterClient<WelcomerClientType>;
    public admins: string[];

    constructor() {
        super({
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
            partials: [Partials.GuildMember],
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
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

        this.cluster = new ClusterClient(this);
        this.admins = process.env.ADMINS?.split(",") || [];

    }

    startClient() {
        loadEvents(this);
        this
            .login(process.env.TOKEN)
            .then(() => {
                console.log("Client is starting")
                console.log(`Bot administators: ${this.admins}`)
                connectMongo()
            })
            .catch((err) => {
                console.error("An error occured while starting the bot", err)
            })
    }
}
