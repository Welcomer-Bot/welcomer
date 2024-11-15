import { Guild, GuildMember, TextChannel } from "discord.js";

import { createCanvas, loadImage } from "canvas";
const canvasTxt = require("canvas-txt").default;
import { AttachmentBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { error } from "./logger";

export const welcomeCard = async (
  member: GuildMember,
  guild: Guild,
  guilds: any,
  client: any,
  testchannel: TextChannel | null = null
) => {
  try {
    if (guilds.welcomer) {
      var channel = guild.channels.cache.find(
        (channel) => channel.id === guilds.welcomer.channel
      ) as TextChannel;

      if (testchannel) {
        channel = testchannel;
      }
      if (!guilds.welcomer.enabled) return;
      if (channel) {
        var mem = member.user;
        var fieldMessage = guilds.welcomer.message
          .replace("{user}", mem.tag)
          .replace("{userid}", mem.id)
          .replace("{username}", mem.globalName ? mem.globalName : mem.username)
          .replace("{guild}", guild.name)
          .replace("{guildid}", guild.id)
          .replace("{membercount}", guild.memberCount);

        var message = guilds.welcomer.textMessage
          .replace("{user}", `<@${member.id}>`)
          .replace("{userid}", mem.id)
          .replace("{username}", mem.username)
          .replace("{guild}", guild.name)
          .replace("{guildid}", guild.id)
          .replace("{membercount}", guild.memberCount);
        message = message.substring(0, 1999);
        fieldMessage = fieldMessage.substring(0, 1999);
        try {
          if (
            guild &&
            channel
              .permissionsFor(client.user)
              .has([
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.ViewChannel,
              ])
          ) {
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

                channel.send({
                  embeds: [embed],
                  files: [attachment],
                });
              } else if (
                guilds.welcomer.imageEnabled &&
                guilds.welcomer.textMessage &&
                !guilds.welcomer.embed.enabled
              ) {
                channel.send({
                  content: message.toString(),
                  files: [attachment],
                });
              } else if (
                guilds.welcomer.imageEnabled &&
                guilds.welcomer.embed.enabled &&
                !guilds.welcomer.textMessage
              ) {
                var embed = new EmbedBuilder()
                  .setColor(guilds.welcomer.embed.color)
                  .setImage("attachment://welcome.png")
                  .setTimestamp();
                channel.send({
                  embeds: [embed],
                  files: [attachment],
                });
              } else if (
                !guilds.welcomer.imageEnabled &&
                guilds.welcomer.embed.enabled &&
                guilds.welcomer.textMessage
              ) {
                var embed = new EmbedBuilder()
                  .setColor(guilds.welcomer.embed.color)
                  .setDescription(message)
                  .setTimestamp();
                channel.send({
                  embeds: [embed],
                });
              } else if (guilds.welcomer.imageEnabled) {
                channel.send({
                  files: [attachment],
                });
              }
            } else if (
              guilds.welcomer.textMessage &&
              guilds.welcomer.embed.enabled
            ) {
              message.substring(0, 256);
              var embed = new EmbedBuilder()

                .setColor(guilds.welcomer.embed.color)
                .setDescription(message)
                .setTimestamp();
              channel.send({
                embeds: [embed],
              });
            } else {
              channel.send(message);
            }
          }
        } catch (err) {
          error(err as Error);
        }
      }
    }
  } catch (err) {
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
    if (guilds.goodbyeer) {
      var channel = guild.channels.cache.find(
        (channel) => channel.id === guilds.goodbyeer.channel
      ) as TextChannel;
      if (testchannel) {
        channel = testchannel;
      }
      if (!guilds.goodbyeer.enabled) return;
      if (channel) {
        var mem = member.user;
        var fieldMessage = guilds.goodbyeer.message
          .replace("{user}", mem.tag)
          .replace("{userid}", mem.id)
          .replace("{username}", mem.username)
          .replace("{guild}", guild.name)
          .replace("{guildid}", guild.id)
          .replace("{membercount}", guild.memberCount);

        var message = guilds.goodbyeer.textMessage
          .replace("{user}", `<@${member.id}>`)
          .replace("{userid}", mem.id)
          .replace("{username}", mem.username)
          .replace("{guild}", guild.name)
          .replace("{guildid}", guild.id)
          .replace("{membercount}", guild.memberCount);
        message = message.substring(0, 1999);
        fieldMessage = fieldMessage.substring(0, 1999);

        try {
          if (
            guild &&
            channel
              .permissionsFor(client.user)
              .has([
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.ViewChannel,
              ])
          ) {
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

                channel.send({
                  embeds: [embed],
                  files: [goodbyeAttachment],
                });
              } else if (
                guilds.goodbyeer.imageEnabled &&
                guilds.goodbyeer.textMessage &&
                !guilds.goodbyeer.embed.enabled
              ) {
                channel.send({
                  content: message.toString(),
                  files: [goodbyeAttachment],
                });
              } else if (
                guilds.goodbyeer.imageEnabled &&
                guilds.goodbyeer.embed.enabled &&
                !guilds.goodbyeer.textMessage
              ) {
                var embed = new EmbedBuilder()
                  .setColor(guilds.goodbyeer.embed.color)
                  .setImage("attachment://goodbye.png")
                  .setTimestamp();
                channel.send({
                  embeds: [embed],
                  files: [goodbyeAttachment],
                });
              } else if (
                !guilds.goodbyeer.imageEnabled &&
                guilds.goodbyeer.embed.enabled &&
                guilds.goodbyeer.textMessage
              ) {
                var embed = new EmbedBuilder()
                  .setColor(guilds.goodbyeer.embed.color)
                  .setDescription(message)
                  .setTimestamp();
                channel.send({
                  embeds: [embed],
                });
              } else if (guilds.goodbyeer.imageEnabled) {
                channel.send({
                  files: [goodbyeAttachment],
                });
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
              channel.send({
                embeds: [embed],
              });
            } else {
              channel.send(message);
            }
          }
        } catch (err) {
          error(err as Error);
        }
      }
    }
  } catch (err) {
    error(err as Error);
  }
};

export const createCard = async (
  member: GuildMember,
  message: string,
  props: any
) => {
  const canvas = createCanvas(1024, 450);
  const ctx = canvas.getContext("2d");
  async function loadAndprocessBackgroundImage(
    ctx: {
      drawImage: (
        arg0: any,
        arg1: number,
        arg2: number,
        arg3: any,
        arg4: any
      ) => void;
    },
    props: { background: any }
  ) {
    try {
      const backgroundImage = await loadImage(
        props?.background
          ? props.background
          : "https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      );
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      const defauldImage = await loadImage(
        "https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      );
      ctx.drawImage(defauldImage, 0, 0, canvas.width, canvas.height);
    }
  }

  await loadAndprocessBackgroundImage(ctx, props);
  // ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  // let background = await Canvas.loadImage(backgroundImg)
  // .then(image => {
  //   ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  // }
  // ).catch(err => {
  //   backgroundImg = "https://cdn.discordapp.com/attachments/830740575082774532/989455827842785310/adrian-infernus-GLf7bAwCdYg-unsplash.jpg";
  //   background = await Canvas.loadImage(backgroundImg)
  //   .then(image => {
  //     ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  //   }
  //   ).catch(err => {
  //     console.log(err);
  //   });
  // });

  // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 1;
  if (props.color) {
    try {
      ctx.fillStyle = props.color;
    } catch (err) {
      ctx.fillStyle = "#000000";
    }
  }
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  if (props.fontSize) {
    try {
      canvasTxt.fontSize = props.fontSize;
    } catch (err) {
      canvasTxt.fontSize = 60;
    }
  }
  canvasTxt.fontFamily = "Arial";
  canvasTxt.fontWeight = "bold";

  // breakWordAndCenter(
  //   ctx,
  //   message,
  //   canvas.width -900,
  //   canvas.height - 200,
  //   75,
  //   800
  // );
  if (props.message) {
    try {
      canvasTxt.drawText(
        ctx,
        message,
        canvas.width - 924,
        canvas.height - 250,
        canvas.width - 200,
        canvas.height - 200
        
      );
    } catch (error) {
      canvasTxt.drawText(
        ctx,
        "Error no message",
        canvas.width - 924,
        canvas.height - 250,
        canvas.width - 200,
        canvas.height - 200
      );
    }
  }
  const pfp = await loadImage(
    //load member avatar
    member.displayAvatarURL({
      extension: "png",
      forceStatic: true,
      size: 256,
    })
  );

  let x = canvas.width / 2 + 128 / 4 - pfp.width / 2;
  let y = 25;

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.arc(x + 100, y + 100, 100, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(pfp, x, y, 200, 200);

  // ctx.drawImage(avatar, 80, 120, 200, 200);

  return canvas.toBuffer();
};
