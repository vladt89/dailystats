import {DatabaseService} from "./databaseService";

export class BrandService {
    private dbService: DatabaseService;
    
    constructor(dbService: DatabaseService) {
        this.dbService = dbService;
    }

    async fetchAllBrands() {
        return this.dbService.fetchAllBrands();
    }
}
