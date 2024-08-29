import { auth } from "@/auth";
import { getBotGuilds } from "@/lib/guilds";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  
  const adminGuilds = session.user.guilds.filter(({ permissions }) => (parseInt(permissions || "0") & 0x8) === 0x8);
  const botGuilds = await getBotGuilds(adminGuilds.map((guild) => guild.id));

  return new Response(JSON.stringify(botGuilds), {
    headers: {
      "Content-Type": "application/json",
    },
  });


}
