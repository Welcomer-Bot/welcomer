import WelcomerClient from "src/structure/WelcomerClient";
import { CloseEvent } from "ws";
import { EventType } from "../../types";

export default class ShardDisconnect implements EventType {
  name = "shardDisconnect";
  once = true;
  async execute(
    closeEvent: CloseEvent,
    shardId: number,
    client: WelcomerClient
  ) {
    if (!shardId) return;
    client.logger.shardStatus(shardId, "disconnect");
  }
}
