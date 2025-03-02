import cron from 'node-cron';
import { createStats } from '../utils/database';

export class CronHandler {
    private daily: cron.ScheduledTask
    private weekly: cron.ScheduledTask
    private monthly: cron.ScheduledTask

    constructor() {
        this.daily = this.scheduleRolloutDailyStats();
        this.weekly = this.scheduleRolloutWeeklyStats();
        this.monthly = this.scheduleRolloutMonthlyStats();
    }

    private scheduleRolloutDailyStats() {
        return cron.schedule("00 00 00 * * *", () => {
            console.log("Running daily stats");
            createStats("DAILY");
        }
        )
    }

    private scheduleRolloutWeeklyStats() {
        return cron.schedule("00 00 00 * * 0", () => {
            console.log("Running weekly stats");
            createStats("WEEKLY");
        }
        )
    }

    private scheduleRolloutMonthlyStats() {
        return cron.schedule("00 00 00 1 * *", () => {
            console.log("Running monthly stats");
            createStats("MONTHLY");
        }
        )
    }

    public stopDaily() {
        this.daily.stop();
    }

    public startDaily() {
        this.daily.start();
    }



    public stopWeekly() {
        this.weekly.stop();
    }

    public startWeekly() {
        this.weekly.start();
    }



    public stopMonthly() {
        this.monthly.stop();
    }

    public startMonthly() {
        this.monthly.start();
    }

    public stopAll() {
        this.daily.stop();
        this.weekly.stop();
        this.monthly.stop();
    }
    public startAll() {
        this.daily.start();
        this.weekly.start();
        this.monthly.start();
    }
}