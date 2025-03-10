import cron from 'node-cron';
import Database from './Database';

export class CronHandler {
    private daily: cron.ScheduledTask
    private weekly: cron.ScheduledTask
    private monthly: cron.ScheduledTask
    private db: Database;
    constructor(db: Database) {
        this.daily = this.scheduleRolloutDailyStats();
        this.weekly = this.scheduleRolloutWeeklyStats();
        this.monthly = this.scheduleRolloutMonthlyStats();
        this.db = db;
    }

    private scheduleRolloutDailyStats() {
        return cron.schedule("00 00 00 * * *", () => {
            console.log("Running daily stats");
            this.db.createStats("DAILY");
        }
        )
    }

    private scheduleRolloutWeeklyStats() {
        return cron.schedule("00 00 00 * * 0", () => {
            console.log("Running weekly stats");
            this.db.createStats("WEEKLY");
        }
        )
    }

    private scheduleRolloutMonthlyStats() {
        return cron.schedule("00 00 00 1 * *", () => {
            console.log("Running monthly stats");
            this.db.createStats("MONTHLY");
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