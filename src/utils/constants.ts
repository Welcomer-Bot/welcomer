import {
  ActionRowBuilder,
  EmbedBuilder,
  InteractionReplyOptions,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export const welcomeKeywords = ["welcome", "greetings", "hello"];
export const leaverkeywords = ["goodbye", "adios", "welcome"];

export const testSelectMenu = new StringSelectMenuBuilder()
  .setCustomId("test-menu")
  .setOptions(
    new StringSelectMenuOptionBuilder({
      label: "Test User Joining",
      value: "Welcome",
      emoji: {
        name: "join",
        id: "1011593313314410496",
      },
    }),
    new StringSelectMenuOptionBuilder({
      label: "Test User Leaving",
      value: "Goodbye",
      emoji: {
        name: "leave",
        id: "1011593334466297918",
      },
    })
  );

export const testCommandMessage: InteractionReplyOptions = {
  flags: "Ephemeral",

  embeds: [
    new EmbedBuilder()
      .setTitle("Select an event to test :arrow_heading_down: ")
      .setColor("#161f2f"),
  ],
  components: [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      testSelectMenu
    ),
  ],
};
