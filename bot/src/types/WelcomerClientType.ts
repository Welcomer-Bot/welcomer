import { ClusterClient } from 'discord-hybrid-sharding';
import { Client, Collection } from 'discord.js';
import { CommandType } from './types';

export default interface WelcomerClientType extends Client {
    client: Map<any, any>;
    commands?: Collection<string, CommandType>,
    modals?: Collection<string, any>,
    buttons?: Collection<string, any>,
    events?: Collection<string, any>,
    selectMenus?: Collection<string, any>,
    commandsData?: Collection<string, any>,
    cluster:  ClusterClient<WelcomerClientType>,
}
