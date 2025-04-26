import {
    BaseMessageOptions,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { CommandType } from "../../types";
import { sendInteractionMessage } from "../../utils/messages";


export default class implements CommandType {
    name = "help";
    description: string = "Get help with the bot";
    ephemeral?: boolean | undefined = true;
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription("Get help with the bot")
        .setContexts([0, 1])
        .addSubcommand((subcommand) =>
            subcommand
                .setName("setup")
                .setDescription("Quick start & setup guide for Welcomer")
        ) as SlashCommandBuilder;
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        let selectedMessage = setupMessage;
        switch (subcommand) {
            case "setup":
                selectedMessage = setupMessage;
                break;
            default:
                selectedMessage = setupMessage
                break;
        }

        await sendInteractionMessage(interaction, selectedMessage);
    }
}

const setupMessage: BaseMessageOptions = {
  content: "",
  embeds: [
    {
      url: "https://beta.welcomer.app/dashboard?utm_source=discord&utm_medium=bot&utm_campaign=help",
      title: "📌 How to setup Welcomer",
      description: `
## Getting Started  
Welcomer makes it easy to set up automated welcome and leave messages through a user-friendly dashboard. Everything is configurable in just a few clicks!  

Head over to [our dashboard](https://beta.welcomer.app/dashboard?utm_source=discord&utm_medium=bot&utm_campaign=help) and select your server to begin.  


## Customizing Your Welcome Message  
Once inside the dashboard:  

🛠️ **Choose a Channel** – This is where your welcome messages will appear.  
💬 **Write a Message** – Use **Markdown** and **dynamic placeholders** like \`{ user }\` for personalization.  
📌 **Enhance with Embeds** – Add up to 10 embeds for a more structured and stylish message.  
🎨 **Generate an Image** – Use the **Active Card** feature to create a custom welcome image.  


## Finalizing Your Setup  
After configuring everything, don't forget to **save your changes**!  

Want to test it? Run \`/ test\` in Discord to preview your welcome message. If something is wrong, the bot will notify you with an error message.  


## Need Assistance?  
For additional help, check out our [support server](https://beta.welcomer.app/support?utm_source=discord&utm_medium=bot&utm_campaign=help)
`,
      color: 3447003,
      footer: {
        text: "🎉 Congratulations! You've successfully configured Welcomer.",
      },
    },
  ],
  components: [
    {
      type: 1,
      components: [
        {
          type: 2,
          label: "Support server",
          style: 5,
          url: "https://beta.welcomer.app/support?utm_source=discord&utm_medium=bot&utm_campaign=help",
        },

        {
          type: 2,
          label: "Docs",
          style: 5,
          url: "https://beta.welcomer.app/docs?utm_source=discord&utm_medium=bot&utm_campaign=help",
        },
        {
          type: 2,
          label: "Dashboard",
          style: 5,
          url: "https://beta.welcomer.app/dahboard?utm_source=discord&utm_medium=bot&utm_campaign=help",
        },
      ],
    },
  ],
};