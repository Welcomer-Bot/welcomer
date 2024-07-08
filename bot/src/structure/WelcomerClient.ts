import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { Client, Collection, GatewayIntentBits, Options, Partials } from "discord.js";
import { connectMongo } from "../utils/database";
import loadEvents from "./loadEvents";
import CommandType from "../types/CommandType";
import EventType from "../types/EventType";

export default class WelcomerClient extends Client {
    public commands: Collection<string, CommandType>;
    public modals: Collection<string, any>;
    public buttons: Collection<string, any>;
    public events: Collection<string, EventType>;
    public selectMenus: Collection<string, any>;
    public commandsData: Collection<string, any>;
    public cluster: ClusterClient<this>;

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

    }

    startClient() {
        this
            .login(process.env.TOKEN)
            .then(() => {
                console.log("Client is starting")
                connectMongo()
                loadEvents(this)
            })
            .catch((err) => {
                console.error("An error occured while starting the bot", err)
            })

    }
}
