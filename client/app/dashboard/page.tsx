import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <span>You are not supposed to be there :(</span>;
  }

  return (
    <span>
      {session.user.guilds.map((guild) => (
        <div key={guild.id}>{guild.name}</div>
      ))}
    </span>
  );
}
