import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image as UIImage } from "@nextui-org/image";
import { default as NextImage } from "next/image";
import Link from "next/link";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <span>You are not supposed to be there :(</span>;
  }

  if (!session.user.guilds) {
    return <span>No guilds found...</span>;
  }

  return (
    <div className="flex flex-wrap items-center justify-center">
      {session.user.guilds.map((guild) => (
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
              <Link href={`/dashboard/${guild.id}`}>
                <Button className="right ml-2 font-bold" color="primary">
                  Manage
                </Button>
              </Link>
            ) : (
              <Link
                href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&permissions=8&scope=bot&guild_id=${guild.id}`}
              >
                <Button
                  className="right ml-2 font-bold"
                  color="default"
                  type="submit"
                >
                  Invite Bot
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
