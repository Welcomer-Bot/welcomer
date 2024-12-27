import { ClusterManager, ClusterManagerOptions, fetchRecommendedShards, HeartbeatManager, keepAliveOptions, ReClusterManager, ReClusterOptions } from "discord-hybrid-sharding";
import "dotenv/config";
import { logStatus } from "./utils/logger";
import "../../instrument.js"

const shardsPerClusters = parseInt(process.env.SHARDS_PER_CLUSTER || "10")

const managerConfig: ClusterManagerOptions = {
    shardsPerClusters,
    mode: "process",
    token: process.env.TOKEN,
    execArgv: [ ...process.execArgv ],
     restarts: {
    max: 5,
    interval: 60 * 60000,
  },
}

const hearthbeatConfig: keepAliveOptions = {
    interval: 2000,
    maxMissedHeartbeats: 5,
}

const clientPath = `${__dirname}/client.js`
const manager = new ClusterManager(clientPath, managerConfig);
manager.extend(new HeartbeatManager(hearthbeatConfig))
manager.extend(new ReClusterManager());

manager.on("clusterCreate", (cluster) => { 
  logStatus({ clusterId: cluster.id, shardId: cluster.shardList.join(','), status: "starting" });
  cluster.on("death", (cluster) => {
    logStatus({ clusterId: cluster.id, shardId: cluster.shardList.join(','), status: "death" });
  })
  cluster.on('error', (error) => {
    console.error("Cluster error", error)
  })
  cluster.on('disconnect', (warn) => {
    console.warn("Cluster disconnect", warn)
  })
  cluster.on('reconnecting', () => {
    logStatus({ clusterId: cluster.id, shardId: cluster.shardList.join(','), status: "reconnecting" });
  })
  cluster.on('resumed', () => {
    logStatus({ clusterId: cluster.id, shardId: cluster.shardList.join(','), status: "resumed" });
  })
});

manager.on("clusterReady", (cluster) => {
  logStatus({ clusterId: cluster.id, shardId: cluster.shardList.join(','), status: "online" });
});


async function spawnClusters() {
  try {
    await manager.spawn({timeout: -1}).then(() => {
      setInterval(async () => {
        await manager.broadcastEval(
          `this.ws.status && this.isReady() ? this.ws.reconnect() : 0`,
        );
      }, 60000);
    });
    setInterval(reclusterShards, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error(error)
  }
}

async function reclusterShards() {
  try {
    const recommendedShards = await fetchRecommendedShards(managerConfig.token!);
    if (recommendedShards !== manager.totalShards) {
      const reclusterConfig: ReClusterOptions = {
        restartMode: "gracefulSwitch",
        totalShards: recommendedShards,
        shardsPerClusters: shardsPerClusters,
        shardList: undefined,
        shardClusterList: undefined,
      };
      (manager.recluster as ReClusterManager).start(reclusterConfig);
    }
  } catch (error) {
    console.error(error)
  }
}
spawnClusters();

process.on("unhandledRejection", (error) => {
  console.error(error)
});

process.on("uncaughtException", (error) => {
  console.error(error);
});


import * as Sentry from "@sentry/node";

try {
  // @ts-expect-error test error
  foo();
} catch (e) {
  Sentry.captureException(e);
}