import { EventType } from "../../types";
import { logStatus } from "../../utils/logger";

export default class ShardReady implements EventType {
  name = "shardReady";
  once = true;
    async execute(closeEvent: CloseEvent, shardId: number) {
      console.log(`Shard ${shardId} is as disconnected`, closeEvent);
    logStatus({ shardId, status: "death" });
  }
}
