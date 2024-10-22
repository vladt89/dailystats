import express, { Request, Response } from 'express';
import {DatabaseService} from "./databaseService";
import {BrandService} from "./brandService";
import {StatsService} from "./statsService";

const app = express();
const port = 3333;

app.use(express.json());

const databaseService = new DatabaseService();
(async () => {
    try {
        await databaseService.initializeDatabase();
    } catch (err) {
        console.error('Error database initialization:', err);
    }
})();

const brandService = new BrandService(databaseService);
const statsService = new StatsService(databaseService);

app.get('/brands', async (req: Request, res: Response) => {
    const brands = await brandService.fetchAllBrands();
    res.json(brands);
});

app.get('/statistics', async (req: Request, res: Response) => {
    const dailyStats = await statsService.fetchAllStats();
    res.json(dailyStats);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
