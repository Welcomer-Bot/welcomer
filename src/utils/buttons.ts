import { ButtonBuilder, ButtonStyle } from "discord.js";

export const autoConfigButton = new ButtonBuilder()
  .setLabel("Setup Welcomer")
  .setStyle(ButtonStyle.Primary)
  .setCustomId("autoConfigButton")
  .setEmoji("<:welcomer:1265400113342451855>");
export const helpButton = new ButtonBuilder()
  .setLabel("Support Server - Help")
  .setStyle(ButtonStyle.Link)
  .setURL("https://discord.com/invite/7TGc5ZZ7aM");
export const dashButton = new ButtonBuilder()
  .setLabel("Dashboard")
  .setStyle(ButtonStyle.Link)
  .setURL(
    "https://beta.welcomer.app/dahsboard?utm_source=discord&utm_medium=bot&utm_campaign=button"
  );
