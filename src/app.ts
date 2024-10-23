import express, { Request, Response } from 'express';
import initializeServices, {asinService, brandService, listingService, statsService} from "./serviceInitializer";

const app = express();
const port = 3333;

app.use(express.json());

app.get('/brands', async (req: Request, res: Response) => {
    console.log("fetching brands");
    const brands = await brandService.fetchAllBrands();
    res.json(brands);
});

app.get('/statistics/:brand/:asin/:day', async (req: Request, res: Response) => {
    const brandName = req.params.brand;
    
    const brand = await brandService.fetchBrandByName(brandName);
    if (brand === null) {
        res.status(404).json({error: `Brand with name ${brandName} is not found`});
        return;
    }

    const asin = req.params.asin;
    const asinData = await asinService.fetchAsinByAsinAndBrandId(asin, brand.id);
    if (asinData === null) {
        res.status(404).json({error: `ASIN with value ${asin} and correlated brand id ${brand.id} is not found`});
        return;
    }
    
    const listing = await listingService.fetchListingByAsin(asinData.id);
    if (listing === null) {
        res.status(404).json({error: `Listing for asin id ${asinData.id} is not found`});
        return;
    }

    const day = req.params.day;
    const datePattern = /^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/;
    if (!datePattern.test(day)) {
        res.status(400).json({error: 'Parameter day has a wrong type'});
        return;
    }
    
    const dailyStats = await statsService.fetchStatsByListingAndDate(listing.id, day);
    res.json(dailyStats);
});

app.post('/statistics', async (req: Request, res: Response) => {
    const { clickAmount, viewTimeSec, listingId } = req.body;
    
    if (!clickAmount) {
        res.status(400).json({error: 'Parameter clickAmount is missing'});
        return;
    }
    let number = parseInt(clickAmount);
    if (isNaN(number)) {
        res.status(400).json({error: 'Parameter clickAmount has wrong type'});
        return;
    }
    
    if (!viewTimeSec) {
        res.status(400).json({error: 'Parameter viewTimeSec is missing'});
        return;
    }
    number = parseInt(viewTimeSec)
    if (isNaN(number)) {
        res.status(400).json({error: 'Parameter viewTimeSec has wrong type'});
        return;
    }
    
    if (!listingId) {
        res.status(400).json({error: 'Parameter listingId is missing'});
        return;
    }
    number = parseInt(listingId);
    if (isNaN(number)) {
        res.status(400).json({error: 'Parameter listingId has wrong type'});
        return;
    }

    const found = await listingService.fetchListingById(listingId);
    if (found == null) {
        res.status(400).json({error: `Listing with listingId ${listingId} is missing`});
        return;
    }
    
    const dailyStats = await statsService.createStats({clickAmount, viewTimeSec, listingId});
    res.status(201).json(dailyStats);
});

const startServer = async () => {
    try {
        await initializeServices();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (e) {
        console.error('Failed to initialize services');
    }
};
startServer();

export default app;
