import { ButtonBuilder, ButtonStyle } from "discord.js";


export const autoConfigButton = new ButtonBuilder()
    .setLabel("Setup Welcomer")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("autoconfig")
    .setEmoji("<:welcomer_new:1262837579062186054>")

export const helpButton = new ButtonBuilder()
    .setLabel("Support Server - Help")
    .setStyle(ButtonStyle.Link)
    .setURL("https://discord.com/invite/7TGc5ZZ7aM");
export const dashButton = new ButtonBuilder()
    .setLabel("Dashboard")
    .setStyle(ButtonStyle.Link)
    .setURL("https://welcomer.app/dahsboard");