import {
  ClusterManager,
  ClusterManagerOptions,
  fetchRecommendedShards,
  HeartbeatManager,
  keepAliveOptions,
  ReClusterManager,
  ReClusterOptions,
} from "discord-hybrid-sharding";
import dotenv from "dotenv";
import path from "path";
import { logStatus } from "./utils/logger";
dotenv.config({ path: path.join(__dirname, "../../.env") });
console.log(
  "TOKEN loaded:",
  !!process.env.TOKEN,
  "Length:",
  process.env.TOKEN?.length
);

let shardsPerClusters = parseInt(process.env.SHARDS_PER_CLUSTER || "10");

let managerConfig: ClusterManagerOptions;
let manager: ClusterManager;

async function initializeManagerConfig() {
  const recommendedShards = await fetchRecommendedShards(process.env.TOKEN!);
  const totalShards = Math.max(1, Math.floor(recommendedShards / 1.5));
  console.log("Recommended shards:", recommendedShards, "Using:", totalShards);
  managerConfig = {
    shardsPerClusters,
    totalShards,
    mode: "process",
    token: process.env.TOKEN,
    execArgv: [...process.execArgv],
    restarts: {
      max: 5,
      interval: 60 * 60000,
    },
  };
}

const heartbeatConfig: keepAliveOptions = {
  interval: 2000,
  maxMissedHeartbeats: 5,
};

(async () => {
  await initializeManagerConfig();

  const clientPath = path.join(__dirname, "client.js");
  manager = new ClusterManager(clientPath, managerConfig);
  manager.extend(new HeartbeatManager(heartbeatConfig));
  manager.extend(new ReClusterManager());

  manager.on("clusterCreate", (cluster) => {
    logStatus({
      clusterId: cluster.id,
      shardId: cluster.shardList.join(","),
      status: "starting",
    });
    cluster.on("death", (cluster) => {
      logStatus({
        clusterId: cluster.id,
        shardId: cluster.shardList.join(","),
        status: "death",
      });
    });
    cluster.on("error", (error) => {
      console.error("Cluster error", error);
    });
    cluster.on("disconnect", (warn) => {
      console.warn("Cluster disconnect", warn);
    });
    cluster.on("reconnecting", (warn) => {
      logStatus({
        clusterId: cluster.id,
        shardId: cluster.shardList.join(","),
        status: "reconnecting",
      });
    });
    cluster.on("resumed", () => {
      logStatus({
        clusterId: cluster.id,
        shardId: cluster.shardList.join(","),
        status: "resumed",
      });
    });
  });

  manager.on("clusterReady", (cluster) => {
    logStatus({
      clusterId: cluster.id,
      shardId: cluster.shardList.join(","),
      status: "online",
    });
  });

  await spawnClusters();
})();

async function spawnClusters() {
  try {
    await manager.spawn({ timeout: -1 }).then(() => {
      setInterval(async () => {
        await manager.broadcastEval(
          `this.ws.status && this.isReady() ? this.ws.reconnect() : 0`
        );
      }, 60000);
    });
    setInterval(reclusterShards, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error(error);
  }
}

async function reclusterShards() {
  try {
    let recommendedShards = await fetchRecommendedShards(managerConfig.token!);
    if (recommendedShards !== manager.totalShards) {
      let reclusterConfig: ReClusterOptions = {
        restartMode: "gracefulSwitch",
        totalShards: recommendedShards / 1.5,
        shardsPerClusters: shardsPerClusters,
        shardList: undefined,
        shardClusterList: undefined,
      };
      (manager.recluster as ReClusterManager).start(reclusterConfig);
    }
  } catch (error) {
    console.error(error);
  }
}

process.on("unhandledRejection", (error) => {
  console.error(error);
});

process.on("uncaughtException", (error) => {
  console.error(error);
});
