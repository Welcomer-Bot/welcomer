import WelcomerClient from "../../models/Client";
import { EventType } from "../../types";

export default class ShardReady implements EventType {
  name = "shardReady";
  once = true;
  async execute(shardId: number, client: WelcomerClient) {
    if (!shardId) return;
    console.log(`Shard ${shardId} is ready`);
    client.logger.shardStatus(shardId, "ready");
  }
}
