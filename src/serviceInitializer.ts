import {BrandService} from "./service/brandService";
import {AsinService} from "./service/asinService";
import {ListingService} from "./service/listingService";
import {StatsService} from "./service/statsService";

const brandService = new BrandService();
const asinService = new AsinService();
const listingService = new ListingService();
const statsService = new StatsService();

const initializeServices = async (createSomeData?: boolean) => {
    try {
        await brandService.getBrand().sync({force: true});
        await asinService.getAsin().sync({force: true});
        await listingService.getListing().sync({force: true});
        await statsService.getDailyStats().sync({force: true});
            
        if (!createSomeData) {
            return;
        }
        console.log("Creating some data...");
        
        const nikeBrand = await brandService.addBrand("Nike");
        const adidasBrand = await brandService.addBrand("Adidas");
        await brandService.addBrand("Hoka");
        
        let asinForNike;
        if (nikeBrand !== undefined) {
            asinForNike = await asinService.addAsin("NIKE_ASIN", nikeBrand.id);
        }
        let asinForAdidas;
        if (adidasBrand !== undefined) {
            asinForAdidas = await asinService.addAsin("ADIDAS_ASIN", adidasBrand.id);
        }
        
        let amazonListing;
        if (asinForNike !== undefined) {
            amazonListing = await listingService.addListing("amazon", asinForNike.id);
        }
        let ebayListing;
        if (asinForAdidas) {
            ebayListing = await listingService.addListing("ebay", asinForAdidas.id);
        }

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const formattedYesterday = yesterday.toISOString().split('T')[0];
        const formattedToday = today.toISOString().split('T')[0];
        
        if (amazonListing !== undefined) {
            await statsService.createStats({
                clickAmount: 10,
                viewTimeSec: 300,
                createdAt: formattedYesterday,
                listingId: amazonListing.id,
            });
            await statsService.createStats({
                clickAmount: 20,
                viewTimeSec: 8754,
                createdAt: formattedToday,
                listingId: amazonListing.id,
            });
        }

        if (ebayListing !== undefined) {
            await statsService.createStats({
                clickAmount: 555,
                viewTimeSec: 20000,
                listingId: ebayListing.id,
            });
        }

        console.log("Some data was created successfully");
    } catch (err) {
        console.error('Error initializing services:', err);
        throw err;
    }
};

export { brandService, asinService, listingService, statsService };
export default initializeServices;
