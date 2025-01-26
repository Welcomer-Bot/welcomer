import { Leaver, Welcomer } from "@prisma/client";
import {
  Guild,
  GuildBasedChannel,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import WelcomerClient from "../models/Client";
import { sendChannelMessage } from "./messages";
import { formatMessage } from "./welcomeModules/message";

export const generateCard = async (
  member: GuildMember,
  guild: Guild,
  module: Welcomer | Leaver,
  client: WelcomerClient,
  testchannel: GuildBasedChannel | null = null,
  type: "welcomer" | "leaver" = "welcomer"
) => {
  try {
    let channel = testchannel;
    if (!channel) {
      channel =
        guild.channels.cache.find(
          (channel) => channel.id === module?.channelId
        ) || null;
    }
    if (!channel) return;
    if (
      client.user &&
      channel.isTextBased() &&
      channel
        .permissionsFor(client.user)
        ?.has([
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ViewChannel,
        ])
    ) {
      const message = await formatMessage(module, type, member);
      sendChannelMessage(channel, message);
    }
  } catch (err) {
    client.logger.error(err as Error);
  }
};

// export const createCard = async (
//   member: GuildMember,
//   message: string,
//   props: any
// ) => {
//   const canvas = createCanvas(1024, 450);
//   const ctx = canvas.getContext("2d");
//   async function loadAndprocessBackgroundImage(
//     ctx: {
//       drawImage: (
//         arg0: any,
//         arg1: number,
//         arg2: number,
//         arg3: any,
//         arg4: any
//       ) => void;
//     },
//     props: { background: any }
//   ) {
//     try {
//       const backgroundImage = await loadImage(
//         props?.background
//           ? props.background
//           : "https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//       );
//       ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
//     } catch (err) {
//       const defauldImage = await loadImage(
//         "https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//       );
//       ctx.drawImage(defauldImage, 0, 0, canvas.width, canvas.height);
//     }
//   }

//   await loadAndprocessBackgroundImage(ctx, props);
//   // ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

//   // let background = await Canvas.loadImage(backgroundImg)
//   // .then(image => {
//   //   ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//   // }
//   // ).catch(err => {
//   //   backgroundImg = "https://cdn.discordapp.com/attachments/830740575082774532/989455827842785310/adrian-infernus-GLf7bAwCdYg-unsplash.jpg";
//   //   background = await Canvas.loadImage(backgroundImg)
//   //   .then(image => {
//   //     ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//   //   }
//   //   ).catch(err => {
//   //     console.log(err);
//   //   });
//   // });

//   // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

//   ctx.globalAlpha = 1;
//   if (props.color) {
//     try {
//       ctx.fillStyle = props.color;
//     } catch (err) {
//       ctx.fillStyle = "#000000";
//     }
//   }
//   ctx.font = "bold 60px Arial";
//   ctx.textAlign = "center";
//   if (props.fontSize) {
//     try {
//       canvasTxt.fontSize = props.fontSize;
//     } catch (err) {
//       canvasTxt.fontSize = 60;
//     }
//   }
//   canvasTxt.fontFamily = "Arial";
//   canvasTxt.fontWeight = "bold";

//   // breakWordAndCenter(
//   //   ctx,
//   //   message,
//   //   canvas.width -900,
//   //   canvas.height - 200,
//   //   75,
//   //   800
//   // );
//   if (props.message) {
//     try {
//       canvasTxt.drawText(
//         ctx,
//         message,
//         canvas.width - 924,
//         canvas.height - 250,
//         canvas.width - 200,
//         canvas.height - 200
//       );
//     } catch (error) {
//       canvasTxt.drawText(
//         ctx,
//         "Error no message",
//         canvas.width - 924,
//         canvas.height - 250,
//         canvas.width - 200,
//         canvas.height - 200
//       );
//     }
//   }
//   const pfp = await loadImage(
//     //load member avatar
//     member.displayAvatarURL({
//       extension: "png",
//       forceStatic: true,
//       size: 256,
//     })
//   );

//   const x = canvas.width / 2 + 128 / 4 - pfp.width / 2;
//   const y = 25;

//   ctx.beginPath();
//   ctx.lineWidth = 5;
//   ctx.strokeStyle = "black";
//   ctx.arc(x + 100, y + 100, 100, 0, Math.PI * 2, true);
//   ctx.stroke();
//   ctx.closePath();
//   ctx.clip();

//   ctx.drawImage(pfp, x, y, 200, 200);

//   // ctx.drawImage(avatar, 80, 120, 200, 200);

//   return canvas.toBuffer();
// };
