import { Guild } from "discord.js";
import { connect, connection } from "mongoose";
import GuildSchema from "../database/schema/Guild";

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
        let guildDb = await GuildSchema.findOne({ id: guild.id });
        if (guildDb) {
            return GuildSchema.updateOne({ id: guild.id }, guild, { new: true });
        } else {
            guildDb = new GuildSchema(guild);
            guildDb._tempData = guild
            return guildDb.save();

        }
    } catch (error) {
        return;
    }
};


export const deleteGuild = async (guildId: string) => {
    try {
        return await GuildSchema.findOneAndDelete({ id: guildId })
    } catch (error) {
        return;
    }

}
