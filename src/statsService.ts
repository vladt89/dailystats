import {DatabaseService} from "./databaseService";

export class StatsService {
    private dbService: DatabaseService;
    
    constructor(dbService: DatabaseService) {
        this.dbService = dbService;
    }

    async fetchAllStats() {
        return this.dbService.fetchAllStats();
    }
}
