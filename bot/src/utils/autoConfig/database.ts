
import { ChannelType, Guild } from "discord.js"
import { Document, Types } from "mongoose"
import AutoConfig, { AutoConfigType } from "../../database/schema/AutoConfig"

export async function getAutoConfig(guild: Guild): Promise<AutoConfigType> {
    try {

        let autoConfig = await AutoConfig.findOne({ guildId: guild.id })
        if (!autoConfig) {
            autoConfig = await createAutoConfig(guild)
        }
        return autoConfig

    } catch (error) {
        throw new Error(`Error getting autoConfig: ${error}`)
    }
}


export async function createAutoConfig(guild: Guild): Promise<Document<unknown, {}, AutoConfigType> & AutoConfigType & {
    _id: Types.ObjectId;
}> {
    try {
        let autoConfig = new AutoConfig({
            guildId: guild.id,
            step: 0,
        })
        await autoConfig.save()
        return autoConfig
    }
    catch (error) {
        throw new Error(`Error creating autoConfig: ${error}`)
    }
}