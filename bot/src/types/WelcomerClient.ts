import { ClusterClient } from 'discord-hybrid-sharding';
import { Client, Collection } from 'discord.js';

export default interface WelcomerClient extends Client {
    commands?: Collection<string, any>,
    modals?: Collection<string, any>,
    buttons?: Collection<string, any>,
    events?: Collection<string, any>,
    selectMenus?: Collection<string, any>,
    commandsData?: Collection<string, any>,
    cluster?:  ClusterClient<WelcomerClient>,
}
