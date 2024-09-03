import { auth } from "@/auth";
import { getGuild } from "@/lib/guilds";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) throw Error("Not authenticated");

  if (!session.user.guilds.find((guild) => guild.id === params.id)) {
    throw Error("Forbidden");
  }

  const guild = await getGuild(params.id);
  if (!guild) throw Error("Not Found");

  return (
    <>
      <h1>{guild.name}</h1>
      <p>{JSON.stringify(guild)}</p>
    </>
  );
}
