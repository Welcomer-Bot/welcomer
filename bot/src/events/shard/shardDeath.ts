import { EventType } from "../../types";
import { logStatus } from "../../utils/logger";

export default class ShardDisconnect implements EventType {
  name = "shardDisconnect";
  once = true;
  async execute(shardId: number) {
    logStatus({ shardId, status: "ready" });
  }
}
