import WelcomerClient from "../../models/Client";
import { EventType } from "../../types";

export default class ShardDisconnect implements EventType {
  name = "shardDisconnect";
  once = true;
  async execute({
    shardId,
    client,
  }: {
    shardId: number;
    client: WelcomerClient;
  }) {
    if (!shardId) return;
    client.logger.shardStatus(shardId, "disconnect");
  }
}
