import {
  ClusterManager,
  ClusterManagerOptions,
  fetchRecommendedShards,
  keepAliveOptions,
  ReClusterManager,
  ReClusterOptions,
} from "discord-hybrid-sharding";
import dotenv from "dotenv";
import path from "path";
import { logStatus } from "./utils/logger";
dotenv.config();
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
  try {
    console.log("Starting bot initialization...");
    await initializeManagerConfig();
    console.log("Manager config initialized");

    const clientPath = path.join(__dirname, "client.js");
    console.log("Client path:", clientPath);

    manager = new ClusterManager(clientPath, managerConfig);
    console.log("ClusterManager created");

    // Temporarily disable HeartbeatManager to debug
    // manager.extend(new HeartbeatManager(heartbeatConfig));
    manager.extend(new ReClusterManager());
    console.log("Extensions added");

    manager.on("clusterCreate", (cluster) => {
      console.log(`Cluster ${cluster.id} created`);
      logStatus({
        clusterId: cluster.id,
        shardId: cluster.shardList.join(","),
        status: "starting",
      });
      cluster.on("death", (cluster) => {
        console.error(`Cluster ${cluster.id} died!`);
        logStatus({
          clusterId: cluster.id,
          shardId: cluster.shardList.join(","),
          status: "death",
        });
      });
      cluster.on("error", (error) => {
        console.error(`Cluster ${cluster.id} error:`, error);
      });
      cluster.on("disconnect", (warn) => {
        console.warn(`Cluster ${cluster.id} disconnect:`, warn);
      });
      cluster.on("reconnecting", (warn) => {
        console.log(`Cluster ${cluster.id} reconnecting:`, warn);
        logStatus({
          clusterId: cluster.id,
          shardId: cluster.shardList.join(","),
          status: "reconnecting",
        });
      });
      cluster.on("resumed", () => {
        console.log(`Cluster ${cluster.id} resumed`);
        logStatus({
          clusterId: cluster.id,
          shardId: cluster.shardList.join(","),
          status: "resumed",
        });
      });
      cluster.on("ready", () => {
        console.log(`Cluster ${cluster.id} is ready!`);
      });
      cluster.on("message", (message) => {
        console.log(`Cluster ${cluster.id} message:`, message);
      });
    });

    manager.on("clusterReady", (cluster) => {
      console.log(`Cluster ${cluster.id} reported ready to manager`);
      logStatus({
        clusterId: cluster.id,
        shardId: cluster.shardList.join(","),
        status: "online",
      });
    });

    console.log("Event listeners registered, spawning clusters...");
    await spawnClusters();
  } catch (error) {
    console.error("Fatal error during initialization:", error);
    process.exit(1);
  }
})();

async function spawnClusters() {
  try {
    console.log("Spawning clusters...");
    await manager.spawn({ timeout: -1 }).then(() => {
      console.log("All clusters spawned successfully");
      setInterval(async () => {
        try {
          await manager.broadcastEval(
            `this.ws.status && this.isReady() ? this.ws.reconnect() : 0`
          );
        } catch (err) {
          console.error("Error in reconnect interval:", err);
        }
      }, 60000);
    });
    setInterval(reclusterShards, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error("Error spawning clusters:", error);
    throw error;
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
  console.error("Unhandled Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Don't exit immediately, log it
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});
