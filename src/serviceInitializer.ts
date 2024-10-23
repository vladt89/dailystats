import {BrandService} from "./brandService";
import {AsinService} from "./asinService";
import {ListingService} from "./listingService";
import {StatsService} from "./statsService";

const brandService = new BrandService();
const asinService = new AsinService();
const listingService = new ListingService();
const statsService = new StatsService();

const initializeServices = async () => {
    try {
        await brandService.getBrand().sync({ force: true });
        const nikeBrand = await brandService.addBrand("Nike");
        await brandService.addBrand("Adidas");
        await brandService.addBrand("Hoka");
        
        console.log("added brands");

        await asinService.getAsin().sync({ force: true });
        let asinForNike;
        if (nikeBrand !== undefined) {
            asinForNike = await asinService.addAsin("B017VXKVXE", nikeBrand.id);
        }

        await listingService.getListing().sync({ force: true });
        let amazonListing;
        if (asinForNike !== undefined) {
            amazonListing = await listingService.addListing("amazon", asinForNike.id);
        }

        await statsService.getDailyStats().sync({ force: true });
        if (amazonListing !== undefined) {
            await statsService.createStats({
                clickAmount: 10,
                viewTimeSec: 300,
                listingId: amazonListing.id,
            });
        }
    } catch (err) {
        console.error('Error initializing services:', err);
        throw err;
    }
};

export { brandService, asinService, listingService, statsService };
export default initializeServices;
