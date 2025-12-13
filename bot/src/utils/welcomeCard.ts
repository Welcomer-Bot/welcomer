import { Guild, GuildMember, TextChannel } from "discord.js";

import { createCanvas, Image, loadImage } from "canvas";
import {
  AttachmentBuilder,
  EmbedBuilder,
  MessageCreateOptions,
  PermissionFlagsBits,
} from "discord.js";
import { error } from "./logger";
const canvasTxt = require("canvas-txt").default;

// Cache for default background image to reduce memory and network usage
let cachedDefaultBackground: Image | null = null;
const DEFAULT_BG_URL =
  "https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

/**
 * Loads and caches the default background image
 */
const getDefaultBackground = async (): Promise<Image> => {
  if (!cachedDefaultBackground) {
    try {
      cachedDefaultBackground = await loadImage(DEFAULT_BG_URL);
      console.log("Default background image cached successfully");
    } catch (err) {
      console.error("Failed to load default background for caching:", err);
      throw err;
    }
  }
  return cachedDefaultBackground;
};

/**
 * Safely sends a message to a channel, handling file upload restrictions
 * Falls back to sending without files if Discord error 400001 occurs
 */
const safeSend = async (
  channel: TextChannel,
  options: MessageCreateOptions,
  guildId: string
) => {
  try {
    return await channel.send(options);
  } catch (err: any) {
    // Handle file upload restriction error
    if (err.code === 400001) {
      console.warn(
        `File uploads restricted for guild ${guildId}, sending without files`
      );

      // Remove files and image references from embeds
      const fallbackOptions = { ...options };
      delete fallbackOptions.files;

      if (fallbackOptions.embeds && fallbackOptions.embeds.length > 0) {
        fallbackOptions.embeds = fallbackOptions.embeds.map((embed) => {
          // Use EmbedBuilder.from() to safely handle both EmbedBuilder and APIEmbed
          const newEmbed = EmbedBuilder.from(embed);
          newEmbed.setImage(null);
          return newEmbed;
        });
      }

      // Send fallback message without files
      try {
        return await channel.send(fallbackOptions);
      } catch (fallbackErr: any) {
        console.error(
          `Failed to send fallback message for guild ${guildId}:`,
          fallbackErr.message
        );
        throw fallbackErr;
      }
    }
  }
};

export const welcomeCard = async (
  member: GuildMember,
  guild: Guild,
  guilds: any,
  client: any,
  testchannel: TextChannel | null = null
) => {
  try {
    if (!guilds?.welcomer) return;

    const channelId = guilds.welcomer.channel;
    if (!channelId) {
      console.warn(`Welcomer enabled but no channel set for guild ${guild.id}`);
      return;
    }

    let channel = guild.channels.cache.get(channelId) as TextChannel;

    if (testchannel) {
      channel = testchannel;
    }

    if (!channel) {
      console.warn(
        `Welcomer channel ${channelId} not found in guild ${guild.id}`
      );
      return;
    }

    if (!guilds.welcomer.enabled) return;

    if (!member?.user) {
      console.error("Invalid member or user object in welcomeCard");
      return;
    }

    const mem = member.user;
    const fieldMessage = (guilds.welcomer.message || "")
      .replace("{user}", mem.tag || mem.username)
      .replace("{userid}", mem.id)
      .replace("{username}", mem.globalName || mem.username)
      .replace("{guild}", guild.name || "Unknown")
      .replace("{guildid}", guild.id)
      .replace("{membercount}", String(guild.memberCount || 0))
      .substring(0, 1999);

    let message = (guilds.welcomer.textMessage || "")
      .replace("{user}", `<@${member.id}>`)
      .replace("{userid}", mem.id)
      .replace("{username}", mem.username)
      .replace("{guild}", guild.name || "Unknown")
      .replace("{guildid}", guild.id)
      .replace("{membercount}", String(guild.memberCount || 0))
      .substring(0, 1999);

    try {
      // Check permissions safely
      const botMember = await guild.members.fetchMe().catch(() => null);
      if (!botMember) {
        console.error(`Cannot fetch bot member in guild ${guild.id}`);
        return;
      }

      const permissions = channel.permissionsFor(botMember);
      if (!permissions) {
        console.error(`Cannot get permissions for channel ${channel.id}`);
        return;
      }

      if (
        !permissions.has([
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ViewChannel,
        ])
      ) {
        console.warn(
          `Missing permissions in channel ${channel.id} for guild ${guild.id}`
        );
        return;
      }
      if (guilds.welcomer.imageEnabled) {
        const welcomeCard = await module.exports.createCard(
          member,
          fieldMessage,
          guilds.welcomer
        );
        const attachment = new AttachmentBuilder(welcomeCard, {
          name: "welcome.png",
        });
        if (
          guilds.welcomer.imageEnabled &&
          guilds.welcomer.textMessage &&
          guilds.welcomer.embed.enabled
        ) {
          message.substring(0, 256);
          var embed = new EmbedBuilder()
            .setColor(guilds.welcomer.embed.color)
            .setDescription(message)
            .setImage("attachment://welcome.png")
            .setTimestamp();

          await safeSend(
            channel,
            {
              embeds: [embed],
              files: [attachment],
            },
            guild.id
          );
        } else if (
          guilds.welcomer.imageEnabled &&
          guilds.welcomer.textMessage &&
          !guilds.welcomer.embed.enabled
        ) {
          await safeSend(
            channel,
            {
              content: message.toString(),
              files: [attachment],
            },
            guild.id
          );
        } else if (
          guilds.welcomer.imageEnabled &&
          guilds.welcomer.embed.enabled &&
          !guilds.welcomer.textMessage
        ) {
          var embed = new EmbedBuilder()
            .setColor(guilds.welcomer.embed.color)
            .setImage("attachment://welcome.png")
            .setTimestamp();
          await safeSend(
            channel,
            {
              embeds: [embed],
              files: [attachment],
            },
            guild.id
          );
        } else if (
          !guilds.welcomer.imageEnabled &&
          guilds.welcomer.embed.enabled &&
          guilds.welcomer.textMessage
        ) {
          var embed = new EmbedBuilder()
            .setColor(guilds.welcomer.embed.color)
            .setDescription(message)
            .setTimestamp();
          await channel
            .send({
              embeds: [embed],
            })
            .catch((err) => {
              console.error(
                `Failed to send welcomer message (embed only):`,
                err.message
              );
            });
        } else if (guilds.welcomer.imageEnabled) {
          await safeSend(
            channel,
            {
              files: [attachment],
            },
            guild.id
          );
        }
      } else if (guilds.welcomer.textMessage && guilds.welcomer.embed.enabled) {
        message.substring(0, 256);
        var embed = new EmbedBuilder()
          .setColor(guilds.welcomer.embed.color)
          .setDescription(message)
          .setTimestamp();
        await channel
          .send({
            embeds: [embed],
          })
          .catch((err) => {
            console.error(
              `Failed to send welcomer message (text+embed):`,
              err.message
            );
          });
      } else if (message) {
        await channel.send(message).catch((err) => {
          console.error(
            `Failed to send welcomer message (text only):`,
            err.message
          );
        });
      }
    } catch (err) {
      console.error(
        `Error sending welcomer message in guild ${guild.id}:`,
        err
      );
      error(err as Error);
    }
  } catch (err) {
    console.error(`Critical error in welcomeCard for guild ${guild.id}:`, err);
    error(err as Error);
  }
};

export const goodbyeCard = async (
  member: GuildMember,
  guild: Guild,
  guilds: any,
  client: any,
  testchannel?: TextChannel
) => {
  try {
    if (!guilds?.goodbyeer) return;

    const channelId = guilds.goodbyeer.channel;
    if (!channelId) {
      console.warn(
        `Goodbyeer enabled but no channel set for guild ${guild.id}`
      );
      return;
    }

    let channel = guild.channels.cache.get(channelId) as TextChannel;

    if (testchannel) {
      channel = testchannel;
    }

    if (!channel) {
      console.warn(
        `Goodbyeer channel ${channelId} not found in guild ${guild.id}`
      );
      return;
    }

    if (!guilds.goodbyeer.enabled) return;

    if (!member?.user) {
      console.error("Invalid member or user object in goodbyeCard");
      return;
    }

    const mem = member.user;
    const fieldMessage = (guilds.goodbyeer.message || "")
      .replace("{user}", mem.tag || mem.username)
      .replace("{userid}", mem.id)
      .replace("{username}", mem.username)
      .replace("{guild}", guild.name || "Unknown")
      .replace("{guildid}", guild.id)
      .replace("{membercount}", String(guild.memberCount || 0))
      .substring(0, 1999);

    let message = (guilds.goodbyeer.textMessage || "")
      .replace("{user}", `<@${member.id}>`)
      .replace("{userid}", mem.id)
      .replace("{username}", mem.username)
      .replace("{guild}", guild.name || "Unknown")
      .replace("{guildid}", guild.id)
      .replace("{membercount}", String(guild.memberCount || 0))
      .substring(0, 1999);

    try {
      // Check permissions safely
      const botMember = await guild.members.fetchMe().catch(() => null);
      if (!botMember) {
        console.error(`Cannot fetch bot member in guild ${guild.id}`);
        return;
      }

      const permissions = channel.permissionsFor(botMember);
      if (!permissions) {
        console.error(`Cannot get permissions for channel ${channel.id}`);
        return;
      }

      if (
        !permissions.has([
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ViewChannel,
        ])
      ) {
        console.warn(
          `Missing permissions in channel ${channel.id} for guild ${guild.id}`
        );
        return;
      }
      if (guilds.goodbyeer.imageEnabled) {
        const goodbyeCard = await module.exports.createCard(
          member,
          fieldMessage,
          guilds.goodbyeer
        );
        const goodbyeAttachment = new AttachmentBuilder(goodbyeCard, {
          name: "goodbye.png",
        });
        if (
          guilds.goodbyeer.imageEnabled &&
          guilds.goodbyeer.textMessage &&
          guilds.goodbyeer.embed.enabled
        ) {
          message.substring(0, 256);
          var embed = new EmbedBuilder()
            .setColor(guilds.goodbyeer.embed.color)
            .setDescription(message)
            .setImage("attachment://goodbye.png")
            .setTimestamp();

          await safeSend(
            channel,
            {
              embeds: [embed],
              files: [goodbyeAttachment],
            },
            guild.id
          );
        } else if (
          guilds.goodbyeer.imageEnabled &&
          guilds.goodbyeer.textMessage &&
          !guilds.goodbyeer.embed.enabled
        ) {
          await safeSend(
            channel,
            {
              content: message.toString(),
              files: [goodbyeAttachment],
            },
            guild.id
          );
        } else if (
          guilds.goodbyeer.imageEnabled &&
          guilds.goodbyeer.embed.enabled &&
          !guilds.goodbyeer.textMessage
        ) {
          var embed = new EmbedBuilder()
            .setColor(guilds.goodbyeer.embed.color)
            .setImage("attachment://goodbye.png")
            .setTimestamp();
          await safeSend(
            channel,
            {
              embeds: [embed],
              files: [goodbyeAttachment],
            },
            guild.id
          );
        } else if (
          !guilds.goodbyeer.imageEnabled &&
          guilds.goodbyeer.embed.enabled &&
          guilds.goodbyeer.textMessage
        ) {
          var embed = new EmbedBuilder()
            .setColor(guilds.goodbyeer.embed.color)
            .setDescription(message)
            .setTimestamp();
          await channel
            .send({
              embeds: [embed],
            })
            .catch((err) => {
              console.error(
                `Failed to send goodbyeer message (embed only):`,
                err.message
              );
            });
        } else if (guilds.goodbyeer.imageEnabled) {
          await safeSend(
            channel,
            {
              files: [goodbyeAttachment],
            },
            guild.id
          );
        }
      } else if (
        guilds.goodbyeer.textMessage &&
        guilds.goodbyeer.embed.enabled
      ) {
        message.substring(0, 256);
        var embed = new EmbedBuilder()
          .setColor(guilds.goodbyeer.embed.color)
          .setDescription(message)
          .setTimestamp();
        await channel
          .send({
            embeds: [embed],
          })
          .catch((err) => {
            console.error(
              `Failed to send goodbyeer message (text+embed):`,
              err.message
            );
          });
      } else if (message) {
        await channel.send(message).catch((err) => {
          console.error(
            `Failed to send goodbyeer message (text only):`,
            err.message
          );
        });
      }
    } catch (err) {
      console.error(
        `Error sending goodbyeer message in guild ${guild.id}:`,
        err
      );
      error(err as Error);
    }
  } catch (err) {
    console.error(`Critical error in goodbyeCard for guild ${guild.id}:`, err);
    error(err as Error);
  }
};

export const createCard = async (
  member: GuildMember,
  message: string,
  props: any
) => {
  // Reduce canvas size for lower memory usage (from 1024x450 to 800x350)
  const canvas = createCanvas(800, 350);
  const ctx = canvas.getContext("2d");

  // Load background image with fallback
  let backgroundImage: any = null;
  try {
    if (props?.background && props.background.startsWith("http")) {
      backgroundImage = await loadImage(props.background);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      backgroundImage = null; // Free memory immediately
    } else {
      // Load cached default background
      const defaultBg = await getDefaultBackground();
      ctx.drawImage(defaultBg, 0, 0, canvas.width, canvas.height);
    }
  } catch (err) {
    console.error("Failed to load background image, using default:", err);
    try {
      // Try cached default background as fallback
      const defaultBg = await getDefaultBackground();
      ctx.drawImage(defaultBg, 0, 0, canvas.width, canvas.height);
    } catch (fallbackErr) {
      console.error("Failed to load default background:", fallbackErr);
      // Use solid color as last resort
      ctx.fillStyle = "#2f3136";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Configure text styling
  ctx.globalAlpha = 1;
  ctx.fillStyle = props?.color || "#000000";
  ctx.font = "bold 48px Arial"; // Reduced from 60px
  ctx.textAlign = "center";

  canvasTxt.fontSize = props?.fontSize ? Math.min(props.fontSize, 48) : 48; // Cap at 48
  canvasTxt.fontFamily = "Arial";
  canvasTxt.fontWeight = "bold";

  // Draw message text
  if (props?.message && message) {
    try {
      canvasTxt.drawText(
        ctx,
        message,
        50, // Adjusted for new canvas size
        canvas.height - 180,
        canvas.width - 100,
        canvas.height - 50
      );
    } catch (textErr) {
      console.error("Failed to draw message text:", textErr);
    }
  }

  // Load and draw avatar with smaller size
  let avatarImage: any = null;
  try {
    // Reduce avatar size from 256 to 128 for memory efficiency
    avatarImage = await loadImage(
      member.displayAvatarURL({
        extension: "png",
        forceStatic: true,
        size: 128, // Reduced from 256
      })
    );

    const avatarSize = 150; // Reduced from 200
    const x = (canvas.width - avatarSize) / 2;
    const y = 20;

    // Save context before clipping
    ctx.save();

    // Create circular clip path for avatar
    ctx.beginPath();
    ctx.arc(
      x + avatarSize / 2,
      y + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.lineWidth = 4; // Reduced from 5
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.clip();
    ctx.closePath();

    ctx.drawImage(avatarImage, x, y, avatarSize, avatarSize);

    // Restore context
    ctx.restore();

    // Free memory
    avatarImage = null;
  } catch (avatarErr) {
    console.error("Failed to load/draw avatar:", avatarErr);
    // Continue without avatar - card will still be valid
  }

  // Generate buffer and return
  const buffer = canvas.toBuffer("image/png", {
    compressionLevel: 6, // Compress PNG (0-9, higher = smaller file but slower)
  });

  return buffer;
};
