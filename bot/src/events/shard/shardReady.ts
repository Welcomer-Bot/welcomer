import { EventType } from "../../types";

export default class ShardReady implements EventType {
  name = "shardReady";
  once = false;
  async execute(shardId: number) {
      if (shardId === undefined) return;
      console.log(`Shard ${shardId} is ready`);
  }
}
