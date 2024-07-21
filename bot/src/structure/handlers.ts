import { APIApplicationCommand, Collection, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { CommandType, EventType, modalType, SelectMenuType } from "../types";
import { loadFiles } from "./loader";
import WelcomerClient from "./WelcomerClient";


export const loadEvents = async function (client: WelcomerClient) {

    client.events = new Collection();
    let events = new Array();
    let files = await loadFiles("dist/events");
    for (let file of files) {
        try {
            let eventFile = require(file).default;
            let event: EventType = new eventFile();
            let execute = (...args: any[]) => event.execute(...args, client);
            let target = event.cluster ? client.cluster : client;
            if (event.prodEvent && process.env.NODE_ENV?.trim() !== "production")
                continue;
            (target as WelcomerClient)[event.once ? "once" : "on"](event.name, execute);
            client.events.set(event.name, event);
            events.push({ Event: event.name, Status: "✅" });
        } catch (e) {
            events.push({ Event: file, Status: "❌" });
            console.error(e)
        }
    }
    console.log(`Loaded ${events.length} events.`);
    console.table(events)
}

export const loadCommands = async function (client: WelcomerClient) {
    client.commands.clear();
    client.commandsData.clear();
    if (!client.application) {
        return console.error("Client application is not initialised.")
    }

    let rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
    let commands_array: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    let command_admin: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    let files = await loadFiles(`dist/commands`);
    // console.log(Files)

    try {
        for (let file of files) {
            let commandFile = require(file).default
            let command: CommandType = new commandFile()
            if (command.admin) {
                command_admin.push(command.data.toJSON());
            } else {
                commands_array.push(command.data.toJSON());
            }
            client.commands.set(command.data.name, command);
        }
        client.application?.commands.set(commands_array);

        for (let command of commands_array) {
            command.dm_permission = false;
        }
        console.log(
            `Started loading ${commands_array.length + command_admin.length} commands`,
        );
        try {


            let data = await rest.put(
                Routes.applicationCommands(client.application?.id),
                { body: commands_array },
            ) as APIApplicationCommand[];

            let data_admin = await rest.put(
                Routes.applicationGuildCommands(
                    client.application.id,
                    process.env.ADMIN_GUILD_ID!,
                ),
                { body: command_admin },
            ) as APIApplicationCommand[];


            if (!data || !data_admin) return console.error("An error occured on loadCommands!");
            data.forEach((command) => {
                client.commandsData.set(command.name, command);
            });
            data_admin.forEach((command) => {
                client.commandsData.set(command.name, command);
            });
            console.log(
                `Loaded ${commands_array.length + command_admin.length} commands`
            );
        }
        catch (error) {
            console.log(error)
        }
    } catch (e) {
        console.error("An error occured on loadCommands!", e);
    }
}


export const loadModals = async function (client: WelcomerClient) {
    client.modals.clear();

    let files = await loadFiles(`dist/modals`);
    try {
        files.forEach((file) => {
            const modalFile = require(file).default
            const modal: modalType = new modalFile()
            if (modal.customId.startsWith("editConfigModal")) {
                // store customId with W and L attached to the end
                client.modals.set(modal.customId + "W", modal);
                client.modals.set(modal.customId + "L", modal);
            } else {
                client.modals.set(modal.customId, modal);
            }
        });
    } catch (e) {
        console.error("An error occured on loadModals!" + e);
    }
}

export const loadSelectMenus = async function (client: WelcomerClient) {
    client.selectMenus.clear();

    let files = await loadFiles(`dist/selectMenus`);
    for (let file of files) {
        try {
            let selectMenuFile = require(file).default;
            let selectMenu: SelectMenuType = new selectMenuFile();
            if (selectMenu.customId.startsWith("editConfigSelectMenu")) {
                // store customId with W and L attached to the end
                client.selectMenus.set(selectMenu.customId + "W", selectMenu);
                client.selectMenus.set(selectMenu.customId + "L", selectMenu);
            } else {
                client.selectMenus.set(selectMenu.customId, selectMenu);
            }
        } catch (e) {
            console.error("An error occured on loadSelectMenus!" + e);
        }
    }
}

export const loadButtons = async function (client: WelcomerClient) {
    client.buttons.clear();

    let files = await loadFiles(`dist/buttons`);
    for (let file of files) {
        try {
            let buttonFile = require(file).default;
            let button: SelectMenuType = new buttonFile();
            client.buttons.set(button.customId, button);
        } catch (e) {
            console.error("An error occured on loadButtons!" + e);
        }
    }
}