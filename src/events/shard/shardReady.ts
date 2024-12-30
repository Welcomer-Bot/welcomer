import WelcomerClient from "src/structure/WelcomerClient";
import { EventType } from "../../types";

export default class ShardReady implements EventType {
  name = "shardReady";
  once = true;
  async execute(shardId: number, client: WelcomerClient) {
    if (!shardId) return;
    client.logger.shardStatus(shardId, "ready");
  }
}
