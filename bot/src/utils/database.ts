import { ChannelType, Guild, GuildTextBasedChannel, TextChannel } from "discord.js";
import { connect, connection } from "mongoose";
import GuildSchema from "../database/shema/Guild";

export const connectMongo = async () => {
    await connect(process.env.MONGO_URI!)
        .then(() => {
            console.log("Connected to MongoDB !")
        })
        .catch((err) => {
            console.error('An error occured while trying to connect to MongoDB database:', err)
        })
}

export const connectionStatus = connection.readyState;

export const createGuild = async (guild: Guild) => {
    try {
        const welcomeKeywords = ['welcome', 'greetings', 'hello'];
        const leaverkeywords = ['goodbye', 'adios', 'welcome']
        let guildDb = await GuildSchema.findOne({ id: guild.id });
        if (guildDb) {
            return GuildSchema.updateOne({ id: guild.id }, guild, { new: true });
        } else {
            
            const matchingWelcomeChannel = guild.systemChannel ?? guild.channels.cache.find(channel =>
                channel.type === ChannelType.GuildText && welcomeKeywords.some(keyword => channel.name.toLowerCase().includes(keyword))
            );
            const matchingGoodbyeChannel = guild.systemChannel ?? guild.channels.cache.find(channel =>
                channel.type === ChannelType.GuildText && leaverkeywords.some(keyword => channel.name.toLowerCase().includes(keyword))
            );
            const guildData = {
                ...guild,
                welcomer: { channel: matchingWelcomeChannel ? matchingWelcomeChannel.id : null, enabled: matchingWelcomeChannel ? true : false },
                leaver: { channel: matchingGoodbyeChannel ? matchingGoodbyeChannel.id : null, enabled: matchingGoodbyeChannel ? true : false }
            };
            guildDb = new GuildSchema(guildData);
            return guildDb.save();
        }
    } catch (error) {
        return console.log(error);
    }
}
