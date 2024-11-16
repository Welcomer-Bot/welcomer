import { EventType } from "../../types";
import { logStatus } from "../../utils/logger";
import { CloseEvent } from "ws";

export default class ShardDisconnect implements EventType {
  name = "shardDisconnect";
  once = true;
  async execute(closeEvent: CloseEvent, shardId: number) {
    if (!shardId) return;
    console.log(`Shard ${shardId} is as disconnected`, closeEvent);
    logStatus({ shardId, status: "death" });
  }
}