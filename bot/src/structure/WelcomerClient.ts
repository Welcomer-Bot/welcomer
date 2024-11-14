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
import { loadFiles } from "./loader";

export default class WelcomerClient
  extends Client
  implements WelcomerClientType
{
  public commands = new Collection<string, CommandType>();
  public modals = new Collection<string, modalType>();
  public buttons = new Collection<string, any>();
  public events = new Collection<string, EventType>();
  public selectMenus = new Collection<string, SelectMenuType>();
  public commandsData = new Collection<string, APIApplicationCommand>();
  public cluster = new ClusterClient<this>(this);
  public admins = process.env.ADMINS?.split(",") || [];
  public images = new Collection<string, AttachmentBuilder>();

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
    this.images.set(
      "banner",
      new AttachmentBuilder("banner.png").setFile("assets/banner.png")
    );
  }

  public async init(): Promise<void> {
    this.loadCommands();
    this.loadEvents();
    this.loadModals();
    this.loadSelectMenus();
    this.loadButtons();
    this.login(process.env.TOKEN)
      .then(() => {
        console.log("Client is starting");
      })
      .catch((err) => {
        console.error("An error occured while starting the bot", err);
      });
  }

  public async loadCommands(reloadRest: boolean = true): Promise<void> {
    this.commands.clear();
    this.commandsData.clear();

    let rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
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

  public async loadEvents(): Promise<void> {
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
  }

  public async loadButtons(): Promise<void> {
    this.buttons.clear();

    let files = await loadFiles(`dist/buttons`);
    for (let file of files) {
      try {
        let buttonFile = require(file).default;
        let button: SelectMenuType = new buttonFile();
        this.buttons.set(button.customId, button);
      } catch (e) {
        console.error("An error occured on loadButtons!" + e);
      }
    }
  }
}
