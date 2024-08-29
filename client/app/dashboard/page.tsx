import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return redirect("/auth/signin");
  }

  return (
    <span>
      {session.user.guilds.map((guild) => (
        <div key={guild.id}>{guild.name}</div>
      ))}
    </span>
  );
}
