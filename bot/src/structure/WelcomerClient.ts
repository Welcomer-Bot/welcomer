import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import {
  APIApplicationCommand,
  AttachmentBuilder,
  Client,
  Collection,
  GatewayIntentBits,
  Options,
  Partials,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import {
  ButtonType,
  CommandType,
  EventType,
  modalType,
  SelectMenuType,
} from "../types";
import { loadFiles } from "./loader";

export default class WelcomerClient extends Client {
  public commands = new Collection<string, CommandType>();
  public modals = new Collection<string, modalType>();
  public buttons = new Collection<string, ButtonType>();
  public events = new Collection<string, EventType>();
  public selectMenus = new Collection<string, SelectMenuType>();
  public commandsData = new Collection<string, APIApplicationCommand>();
  public cluster = new ClusterClient<this>(this);
  public admins = process.env.ADMINS?.split(",") || [];
  public images = new Map<string, AttachmentBuilder>();
  public managerReady: boolean = false;

  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  constructor() {
    console.log("WelcomerClient constructor started");
    super({
      presence: {
        status: "online",
      },
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
        PresenceManager: 0,
        DMMessageManager: 0,
        GuildMessageManager: 0,
        ThreadMemberManager: 0,
        AutoModerationRuleManager: 0,
        BaseGuildEmojiManager: 0,
        GuildBanManager: {
          maxSize: 1,
        },
        GuildForumThreadManager: 0,
        GuildInviteManager: 0,
        GuildTextThreadManager: 0,
        VoiceStateManager: 0,
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
          filter: () => (user) => user.id !== user.client.user.id, // Remove all bots.
        },
        guildMembers: {
          interval: 1_600, // Every 30 min.
          filter: () => (member) => member.id !== member.client.user.id, // Remove all bots.
        },
      },
    });
    console.log("Discord.js Client initialized");

    this.cluster.on("ready", () => {
      console.log("Cluster client ready event");
      this.managerReady = true;
    });

    console.log("Starting init()...");
    this.init();

    this.images.set(
      "banner",
      new AttachmentBuilder("banner.png").setFile("assets/banner.png")
    );
    console.log("WelcomerClient constructor completed");
  }

  public async init(): Promise<void> {
    console.log("Loading commands...");
    this.loadCommands();
    console.log("Loading events...");
    this.loadEvents();
    console.log("Loading modals...");
    this.loadModals();
    console.log("Loading select menus...");
    this.loadSelectMenus();
    console.log("Loading buttons...");
    this.loadButtons();

    console.log("Logging in to Discord...");
    this.login(process.env.TOKEN)
      .then(() => {
        console.log("Login successful, client is starting");
      })
      .catch((err) => {
        console.error("An error occured while starting the bot", err);
        throw err;
      });
  }

  public async loadCommands(): Promise<void> {
    this.commands.clear();
    this.commandsData.clear();

    let commands_array: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    let command_admin: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    let files = await loadFiles(`dist/commands`);

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

      // Clear temporary arrays to free memory
      commands_array = [];
      command_admin = [];
      files = [];
    } catch (e) {
      console.error("An error occured on loadCommands!", e);
    }
  }

  public async loadEvents(): Promise<void> {
    // Remove all existing event listeners before reloading
    this.removeAllListeners();
    this.cluster.removeAllListeners();

    this.events.clear();
    let events = new Array();
    let files = await loadFiles("dist/events");
    for (let file of files) {
      try {
        let eventFile = require(file).default;
        let event: EventType = new eventFile();
        let execute = (...args: any[]) => event.execute(...args, this);
        let target = event.cluster ? this.cluster : this;
        if (event.prodEvent && process.env.NODE_ENV?.trim() !== "production")
          continue;
        (target as WelcomerClient)[event.once ? "once" : "on"](
          event.name,
          execute
        );
        this.events.set(event.name, event);
        events.push({ Event: event.name, Status: "✅" });
      } catch (e) {
        events.push({ Event: file, Status: "❌" });
        console.error(e);
      }
    }
    console.log(`Loaded ${events.length} events.`);
    console.table(events);

    // Clear temporary arrays to free memory
    events = [];
    files = [];
  }

  public async loadModals(): Promise<void> {
    this.modals.clear();

    let files = await loadFiles(`dist/modals`);
    try {
      files.forEach((file) => {
        const modalFile = require(file).default;
        const modal: modalType = new modalFile();
        if (modal.customId.startsWith("editConfigModal")) {
          // store customId with W and L attached to the end
          this.modals.set(modal.customId + "W", modal);
          this.modals.set(modal.customId + "L", modal);
        } else {
          this.modals.set(modal.customId, modal);
        }
      });

      // Clear temporary array to free memory
      files = [];
    } catch (e) {
      console.error("An error occured on loadModals!" + e);
    }
  }

  public async loadSelectMenus(): Promise<void> {
    this.selectMenus.clear();

    let files = await loadFiles(`dist/selectMenus`);
    for (let file of files) {
      try {
        let selectMenuFile = require(file).default;
        let selectMenu: SelectMenuType = new selectMenuFile();
        if (selectMenu.customId.startsWith("editConfigSelectMenu")) {
          // store customId with W and L attached to the end
          this.selectMenus.set(selectMenu.customId + "W", selectMenu);
          this.selectMenus.set(selectMenu.customId + "L", selectMenu);
        } else {
          this.selectMenus.set(selectMenu.customId, selectMenu);
        }
      } catch (e) {
        console.error("An error occured on loadSelectMenus!" + e);
      }
    }

    // Clear temporary array to free memory
    files = [];
  }

  public async loadButtons(): Promise<void> {
    this.buttons.clear();

    let files = await loadFiles(`dist/buttons`);
    for (let file of files) {
      try {
        let buttonFile = require(file).default;
        let button: ButtonType = new buttonFile();
        this.buttons.set(button.customId, button);
      } catch (e) {
        console.error("An error occured on loadButtons!" + e);
      }
    }

    // Clear temporary array to free memory
    files = [];
  }
}
