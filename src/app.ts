import express, { Request, Response } from 'express';
import {BrandService} from "./brandService";
import {StatsService} from "./statsService";
import {ListingService} from "./listingService";
import {AsinService} from "./asinService";

const app = express();
const port = 3333;

app.use(express.json());

const brandService = new BrandService();
const asinService = new AsinService();
const listingService = new ListingService();
const statsService = new StatsService();

(async () => {
    try {
        await brandService.getBrand().sync({force: true});
        const nikeBrand = await brandService.addBrand("Nike");
        await brandService.addBrand("Adidas");
        await brandService.addBrand("Hoka");

        await asinService.getAsin().sync({force: true});
        let asinForNike;
        if (nikeBrand !== undefined) {
            asinForNike = await asinService.addAsin("B017VXKVXE", nikeBrand.id);
        }

        await listingService.getListing().sync({force: true});
        let amazonListing;
        if (asinForNike !== undefined) {
            amazonListing = await listingService.addListing("amazon", asinForNike.id);
        }

        await statsService.getDailyStats().sync({force: true});
        if (amazonListing !== undefined) {
            await statsService.createStats({clickAmount: 10, viewTimeSec: 300, listingId: amazonListing.id});
        }
    } catch (err) {
        console.error('Error database initialization:', err);
    }
})();

app.get('/brands', async (req: Request, res: Response) => {
    const brands = await brandService.fetchAllBrands();
    res.json(brands);
});

app.get('/statistics', async (req: Request, res: Response) => {
    const brandName = req.query.brand;
    if (typeof brandName !== 'string') {
        res.status(400).json({error: 'Parameter brandName has a wrong type'});
        return;
    }
    
    const brand = await brandService.fetchBrandByName(brandName);
    if (brand === null) {
        res.status(404).json({error: `Brand with name ${brandName} is not found`});
        return;
    }

    const asin = req.query.asin;
    if (typeof asin !== 'string') {
        res.status(400).json({error: 'Parameter asin has a wrong type'});
        return;
    }
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

    const day = req.query.day;
    const datePattern = /^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/;
    if (typeof day !== "string" || !datePattern.test(day)) {
        res.status(400).json({error: 'Parameter day has a wrong type'});
        return;
    }
    
    const dailyStats = await statsService.fetchStatsByListingAndDate(listing.id, day);
    res.json(dailyStats);
});

app.post('/statistics', async (req: Request, res: Response) => {
    const { clickAmount, viewTimeSec, listingId } = req.body;
    
    // TODO check that input parameters are numbers
    if (!clickAmount) {
        res.status(400).json({error: 'Parameter clickAmount is missing'});
        return;
    }
    if (!viewTimeSec) {
        res.status(400).json({error: 'Parameter viewTimeSec is missing'});
        return;
    }
    if (!listingId) {
        res.status(400).json({error: 'Parameter listingId is missing'});
        return;
    }

    const found = await listingService.fetchListingById(listingId);
    if (found == null) {
        res.status(400).json({error: `Listing with listingId ${listingId} is missing`});
        return;
    }
    
    const dailyStats = await statsService.createStats({ clickAmount, viewTimeSec, listingId});
    res.status(201).json(dailyStats);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
