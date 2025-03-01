import { init } from "@sentry/node";
import {
  ClusterManager,
  ClusterManagerOptions,
  fetchRecommendedShards,
  HeartbeatManager,
  keepAliveOptions,
  ReClusterManager,
  ReClusterOptions,
} from "discord-hybrid-sharding";
import "dotenv/config";
import { CronHandler } from "./models/Cron";
import Logger from "./models/Logger";

if (
  !process.env.LOG_WEBHOOK ||
  !process.env.STATUS_WEBHOOK ||
  !process.env.ADD_REMOVE_WEBHOOK
) {
  throw new Error("Missing webhook urls in .env");
}


if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
  });
}

const logger = new Logger(
  process.env.LOG_WEBHOOK,
  process.env.STATUS_WEBHOOK,
  process.env.ADD_REMOVE_WEBHOOK
);

new CronHandler();

const shardsPerClusters = parseInt(process.env.SHARDS_PER_CLUSTER || "10");

const managerConfig: ClusterManagerOptions = {
  shardsPerClusters,
  mode: "process",
  token: process.env.TOKEN,
  execArgv: [...process.execArgv],
  restarts: {
    max: 5, // Maximum amount of restarts per cluster
    interval: 60000 * 60, // Interval to reset restarts
  },
};

const hearthbeatConfig: keepAliveOptions = {
  interval: 2000,
  maxMissedHeartbeats: 5,
};

const clientPath = `${__dirname}/client.js`;
const manager = new ClusterManager(clientPath, managerConfig);
manager.extend(new HeartbeatManager(hearthbeatConfig));
manager.extend(new ReClusterManager());

manager.on("clusterCreate", (cluster) => {
  logger.status(cluster, "starting");
  cluster.on("death", (cluster) => {
    logger.status(cluster, "death");
  });
  cluster.on("error", (error) => {
    console.error("Cluster error", error);
  });
  cluster.on("disconnect", (warn) => {
    console.warn("Cluster disconnect", warn);
  });
  cluster.on("reconnecting", () => {
    logger.status(cluster, "reconnecting");
  });
  cluster.on("resumed", () => {
    logger.status(cluster, "resumed");
  });
});

manager.on("clusterReady", (cluster) => {
  logger.status(cluster, "ready");
});

async function spawnClusters() {
  try {
    await manager
      .spawn({ timeout: -1 })
      .then(() => {
        setInterval(async () => {
          await manager.broadcastEval(
            `this.ws.status && this.isReady() ? this.ws.reconnect() : 0`
          );
        }, 60000);
      })
      .catch((error) => {
        console.error(error);
      });
    setInterval(reclusterShards, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error(error);
  }
}

async function reclusterShards() {
  try {
    const recommendedShards = await fetchRecommendedShards(
      managerConfig.token!
    );
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
    console.error(error);
  }
}
spawnClusters();

process.on("unhandledRejection", (error) => {
  console.error(error);
});

process.on("uncaughtException", (error) => {
  console.error(error);
});
