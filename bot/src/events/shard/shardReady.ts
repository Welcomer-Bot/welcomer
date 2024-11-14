import { EventType } from "../../types";
import { logStatus } from "../../utils/logger";

export default class ShardReady implements EventType {
  name = "shardReady";
  once = true;
  async execute(shardId: number) {
      if (!shardId) return;
      console.log(`Shard ${shardId} is as started`);
    logStatus({ shardId, status: "start" });
  }
}
