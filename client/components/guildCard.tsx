"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image as UIImage,
} from "@nextui-org/react";
import NextImage from "next/image";
import { redirect } from "next/navigation";

import { inviteBot } from "@/lib/auth";
import { GuildFormated } from "@/lib/guilds";

const GuildCard = ({ guild }: { guild: GuildFormated }) => {
  return (
    <Card
      key={guild.id}
      className="w-[350] relative radius-8 mb-10 min-w-60 justify-evenly mx-4"
    >
      <CardBody className="p-0 flex justify-center">
        <div
          style={{
            backgroundImage: `url(${guild.icon || "/logo32.svg"})`,
            filter: "blur(10px)",
            height: "120px",
            backgroundSize: "cover",
            borderRadius: "8px",
            opacity: 0.7,
            backgroundPosition: "center",
          }}
        />
      </CardBody>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-row items-center">
          {guild.icon ? (
            <UIImage
              alt="Guild Icon"
              as={NextImage}
              classNames={{
                img: "border-solid border-1 border-white shadow-2xl",
                wrapper: "mr-3 w-12 h-12",
              }}
              height={50}
              src={guild.icon || "/logo32.svg"}
              width={50}
            />
          ) : (
            <div className="w-12 h-12 border-solid border-2 border-white shadow-2xl rounded-large flex justify-center items-center mr-3">
              {guild.name[0]}
            </div>
          )}

          {guild.name}
        </div>
        {guild.mutual ? (
          <Button
            className="right ml-2 font-bold"
            color="primary"
            onPress={() => redirect(`/${guild.id}`)}
          >
            Manage
          </Button>
        ) : (
          <Button
            className="right ml-2 font-bold"
            color="default"
            onPress={() => inviteBot(guild.id)}
          >
            Invite Bot
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GuildCard;
