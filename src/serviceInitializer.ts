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
        await brandService.addBrand("Adidas");
        await brandService.addBrand("Hoka");
        
        let asinForNike;
        if (nikeBrand !== undefined) {
            asinForNike = await asinService.addAsin("B017VXKVXE", nikeBrand.id);
        }
        
        let amazonListing;
        if (asinForNike !== undefined) {
            amazonListing = await listingService.addListing("amazon", asinForNike.id);
        }
        
        if (amazonListing !== undefined) {
            await statsService.createStats({
                clickAmount: 10,
                viewTimeSec: 300,
                listingId: amazonListing.id,
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
