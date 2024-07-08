import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { Client, GatewayIntentBits, Options, Partials, Collection } from "discord.js";
import { connectMongo } from "../utils/database";

export default class WelcomerClient {
    private client: Client;
    public commands: Collection<string, any>;
    public modals: Collection<string, any>;
    public buttons: Collection<string, any>;
    public events: Collection<string, any>;
    public selectMenus: Collection<string, any>;
    public commandsData: Collection<string, any>;
    public cluster: ClusterClient<Client>;

    constructor() {
        this.client = new Client({
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
        });
        this.commands = new Collection();
        this.modals = new Collection();
        this.buttons = new Collection();
        this.events = new Collection();
        this.selectMenus = new Collection();
        this.commandsData = new Collection();

        this.cluster = new ClusterClient(this.client);

    }

    startClient() {
        this.client
            .login(process.env.TOKEN)
            .then(() => {
                connectMongo()
                console.log("client is starting")
            })

    }
}
