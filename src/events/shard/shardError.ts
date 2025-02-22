import { EventType } from "../../types";

export default class ShardError implements EventType {
  name = "shardError";
  once = true;
    async execute(error: Error, shardId: number) {
    console.log(`Shard ${shardId} has encountered an error`, error);
  }
}
