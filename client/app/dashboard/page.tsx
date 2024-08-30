import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";

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
          {/* <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
          </div> */}
          <CardFooter className="flex items-center justify-between">
            <div className="flex flex-row items-center">

            {guild.icon ? (
              <Image
              alt="Guild Icon"
              as={NextImage}
                classNames={{img :"border-solid border-1 border-white shadow-2xl", wrapper: "mr-2"}}
                height={50}
                src={guild.icon || "/logo32.svg"}
                  width={50}
              />
            ) : (
              <div className="w-[50] h-[50] border-solid border-2 border-white shadow-2xl rounded-large flex justify-center items-center mr-2">
                {guild.name[0]}
              </div>
            )}

            {guild.name}
              </div>
            <Button className="right" color="primary">
              Manage
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
