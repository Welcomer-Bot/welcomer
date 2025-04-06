import type { Guild, WebSocketShard } from "discord.js";
import express, { Request, Response } from "express";
import WelcomerClient from "./Client";

interface ShardStats {
  id: number;
  status: string;
  ping: number;
  guilds: number;
  members: number;
}

export default class Server {
  private client: WelcomerClient;
  private port: number;
  private app: express.Application;

  constructor(client: WelcomerClient, port = 2845) {
    this.client = client;
    this.port = process.env.PORT ? Number.parseInt(process.env.PORT) : port;
    this.app = express();
    this.initializeRoutes();
  }

  private async getRequestStats(): Promise<ShardStats[]> {
    const results = await this.client?.cluster.broadcastEval((client) => {
      const statsPerShard = client.ws.shards.map((shard: WebSocketShard) => {
        return {
          id: shard.id,
          status: shard.status,
          ping: Math.floor(shard.ping),
          guilds: client.guilds.cache.filter(
            (g: Guild) => g.shardId === shard.id
          ).size,
          members: client.guilds.cache
            .filter((g: Guild) => g.shardId === shard.id)
            .reduce((a: number, b: Guild) => a + b.memberCount, 0),
        };
      });
      return statsPerShard;
    });
    return results as unknown as ShardStats[];
  }

  private initializeRoutes(): void {
    this.app.get("/status", async (req: Request, res: Response) => {
      if (req.headers.authorization !== process.env.SERVER_TOKEN)
        return res.status(401).json({ error: "Unauthorized" });
      try {
        const stats = await this.getRequestStats();
        res.json(stats);
      } catch {
        res.status(500).json({ error: "Failed to fetch stats" });
      }
    });

    this.app.get("/channels", async (req: Request, res: Response) => {
      if (req.headers.authorization !== process.env.SERVER_TOKEN)
        return res.status(401).json({ error: "Unauthorized" });
      const guildId = req.query.guildId as string;
      if (!guildId)
        return res.status(400).json({ error: "Guild ID is required" });
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).json({ error: "Guild not found" });
      const channels = guild.channels.cache;
      return res.json(channels);
    });

    this.app.get("/status/:id", async (req: Request, res: Response) => {
      //get shard by guild id
      const guildId = req.params.id;
      const shard = this.client.guilds.cache.get(guildId)?.shardId;
      if (shard == null)
        return res.status(404).json({ error: "Shard not found" });
      return res.json({
        id: shard,
        status: this.client.ws.shards.get(shard)?.status,
      });
    });
  }

  public startServer(): void {
    this.app.listen(this.port, () => {
      console.log("Server is running on port " + this.port);
    });
  }
}
