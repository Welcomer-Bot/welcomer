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
            let guildDb = new GuildSchema(guild);
            guildDb._tempData = guild
            await guildDb.save();
        return guildDb;

    } catch (error) {
        throw new Error("An error occured while trying to save the guild to the database: " + error)
    }
};


export const deleteGuild = async (guild: Guild) => {
    try {
        return await GuildSchema.findOneAndDelete({ id: guild.id })
    } catch (error) {
        throw new Error("An error occured while trying to delete the guild from the database: " + error)
    }

};

export const getGuild = async (guild: Guild) => {
    try {
        let guildDb = await GuildSchema.findOne({ id: guild.id });
        if (!guildDb) {
            guildDb = await createGuild(guild)
        }
        return guildDb;
    } catch (error) {
        throw new Error("An error occured while trying to get the guild from the database: " + error)
    }
}
