import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import {
  ActivityType,
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
  ModalType,
  SelectMenuType,
} from "../types";
import { loadFiles } from "./loader";

export default class WelcomerClient extends Client {
  public commands = new Collection<string, CommandType>();
  public modals = new Collection<string, ModalType>();
  public buttons = new Collection<string, ButtonType>();
  public events = new Collection<string, EventType>();
  public selectMenus = new Collection<string, SelectMenuType>();
  public commandsData = new Collection<string, APIApplicationCommand>();
  public cluster = new ClusterClient<this>(this);
  public admins = process.env.ADMINS?.split(",") || [];
  public images = new Map<string, AttachmentBuilder>();
  public managerReady: boolean = false;
  emit(event: string, ...args: unknown[]): boolean {
    return super.emit(event, ...args);
  }

  constructor() {
    super({
      presence: {
        status: "dnd",
        activities: [
          {
            name: "gears booting up..",
            type: ActivityType.Watching,
          },
        ],
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
        GuildMemberManager: {
          maxSize: 1,
          keepOverLimit: (member) => member.id === member.client.user.id,
        },
        GuildMessageManager: 0,
        GuildBanManager: 0,
        PresenceManager: 0,
        VoiceStateManager: 0,
      }),
      sweepers: {
        ...Options.DefaultSweeperSettings,
        users: {
          interval: 3_600, // Every hour.
          filter: () => (user) => user.bot && user.id !== user.client.user.id, // Remove all bots.
        },
      },
    });
    this.init();
    this.images.set(
      "banner",
      new AttachmentBuilder("banner.png").setFile("assets/banner.png")
    );

    this.cluster.on("ready", () => {
      this.loadEvents();
    })
    
    
  }

  public async init(): Promise<void> {
    this.loadCommands();
    this.loadEvents();
    // this.loadModals();
    this.loadSelectMenus();
    this.loadButtons();

    this.cluster.on("managerReady", () => {
      this.managerReady = true;
    });
    this.login(process.env.TOKEN)
      .then(() => {
        console.log("Client is starting");
      })
      .catch((err) => {
        console.error("An error occured while starting the bot", err);
      });
  }

  public async loadCommands(): Promise<void> {
    this.commands.clear();
    this.commandsData.clear();

    const commands_array: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
      [];
    const command_admin: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    const files = await loadFiles(`commands`);

    try {
      for (const file of files) {
        const { default: commandFile } = await import(file);
        const command: CommandType = new commandFile();
        if (command.admin) {
          command_admin.push(command.data.toJSON());
        } else {
          commands_array.push(command.data.toJSON());
        }
        this.commands.set(command.data.name.toLowerCase(), command);
      }
    } catch (e) {
      console.error("An error occured on loadCommands!", e);
    }
  }

  public async loadEvents(): Promise<void> {
    this.events.clear();
    const events = [];
    const files = await loadFiles("events");
    for (const file of files) {
      try {
        const { default: eventFile } = await import(file);
        const event: EventType = new eventFile();
        const execute = (...args: unknown[]) => event.execute(...args, this);
        const target = event.cluster ? this.cluster : this;
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
  }

  public async loadModals(): Promise<void> {
    this.modals.clear();

    const files = await loadFiles(`modals`);
    try {
      files.forEach(async (file) => {
        const { default: modalFile } = await import(file);
        const modal: ModalType = new modalFile();
        if (modal.customId.startsWith("editConfigModal")) {
          // store customId with W and L attached to the end
          this.modals.set(modal.customId + "W", modal);
          this.modals.set(modal.customId + "L", modal);
        } else {
          this.modals.set(modal.customId, modal);
        }
      });
    } catch (e) {
      console.error("An error occured on loadModals!" + e);
    }
  }

  public async loadSelectMenus(): Promise<void> {
    this.selectMenus.clear();

    const files = await loadFiles(`selectMenus`);
    for (const file of files) {
      try {
        const { default: selectMenuFile } = await import(file);
        const selectMenu: SelectMenuType = new selectMenuFile();
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
  }

  public async loadButtons(): Promise<void> {
    this.buttons.clear();

    const files = await loadFiles(`buttons`);
    for (const file of files) {
      try {
        const { default: buttonFile } = await import(file);
        const button: ButtonType = new buttonFile();
        this.buttons.set(button.customId, button);
      } catch (e) {
        console.error("An error occured on loadButtons!" + e);
      }
    }
  }

}
