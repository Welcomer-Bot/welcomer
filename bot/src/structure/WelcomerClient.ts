import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import {
  APIApplicationCommand,
  AttachmentBuilder,
  Client,
  Collection,
  GatewayIntentBits,
  Options,
  Partials,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { CommandType, EventType, modalType, SelectMenuType } from "../types";
import WelcomerClientType from "../types/WelcomerClientType";
import { loadEvents } from "./handlers";
import { loadFiles } from "./loader";

export default class WelcomerClient extends Client implements WelcomerClientType {
  public commands = new Collection<string, CommandType>();
  public modals = new Collection<string, modalType>();
  public buttons = new Collection<string, any>();
  public events = new Collection<string, EventType>();
  public selectMenus = new Collection<string, SelectMenuType>();
  public commandsData = new Collection<string, APIApplicationCommand>();
  public cluster: ClusterClient<this>;
  public admins: string[];
  public images: Collection<string, AttachmentBuilder>;

  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

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
    });
    this.init();
    this.images = new Collection();

    this.cluster = new ClusterClient(this);
    this.admins = process.env.ADMINS?.split(",") || [];

    this.images.set(
      "banner",
      new AttachmentBuilder("banner.png").setFile("assets/banner.png")
    );
  }

  public async init(): Promise<void> {
    loadEvents(this);
    this.login(process.env.TOKEN)
    .then(() => {
      console.log("Client is starting");
    })
    .catch((err) => {
      console.error("An error occured while starting the bot", err);
    });
    this.loadCommands();
  }

  public async loadCommands(reloadRest: boolean = false): Promise<void> {
    this.commands.clear();
    this.commandsData.clear();

    let rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
    let commands_array: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    let command_admin: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    let files = await loadFiles(`dist/commands`);
    // console.log(Files)

    try {
      for (let file of files) {
        let commandFile = require(file).default;
        let command: CommandType = new commandFile();
        if (command.admin) {
          command_admin.push(command.data.toJSON());
        } else {
          commands_array.push(command.data.toJSON());
        }
        this.commands.set(command.data.name.toLowerCase(), command);
      }
      this.application?.commands.set(commands_array);

      if (reloadRest) {
        console.log(
          `Started loading ${
            commands_array.length + command_admin.length
          } commands`
        );
        try {
          let data = (await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands_array }
          )) as APIApplicationCommand[];

          let data_admin = (await rest.put(
            Routes.applicationGuildCommands(
              process.env.CLIENT_ID!,
              process.env.ADMIN_GUILD_ID!
            ),
            { body: command_admin }
          )) as APIApplicationCommand[];

          if (!data || !data_admin)
            return console.error("An error occured on loadCommands!");
          data.forEach((command) => {
            this.commandsData.set(command.name, command);
          });
          data_admin.forEach((command) => {
            this.commandsData.set(command.name, command);
          });
          console.log(
            `Loaded ${commands_array.length + command_admin.length} commands`
          );
        } catch (error) {
          console.log(error);
        }
      }
    } catch (e) {
      console.error("An error occured on loadCommands!", e);
    }
  }
}
