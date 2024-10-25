import createDailyStats from "../db/dailyStats";
import {Op} from "sequelize";

export class StatsService {
    private dailyStats: ReturnType<typeof createDailyStats>;
    
    constructor() {
        this.dailyStats = createDailyStats();
    }

    async fetchStats() {
        return await this.dailyStats.findAll();
    }

    async fetchStatsByListingAndDate(listingId: number, date: string) {
        const startDate = new Date(`${date}T00:00:00`);
        const endDate = new Date(`${date}T23:59:59`);
        
        return await this.dailyStats.findAll({
            where: {
                listingId: listingId,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    }

    async createStats(param: { clickAmount: number; viewTimeSec: number; listingId: number; createdAt?: string }) {
        return await this.dailyStats.create(param);
    }
    
    getDailyStats() {
        return this.dailyStats;
    }
}
