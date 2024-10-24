import createListing from "../db/listing";

export class ListingService {
    private listing: ReturnType<typeof createListing>;
    
    constructor() {
        this.listing = createListing();
    }

    async addListing(marketplace: string, asinId: number) {
        let listing;
        try {
            listing = await this.listing.create({marketplace, asinId});
        } catch (e: any) {
            console.log(`Failed to add listing with marketplace ${marketplace}: ${e.message}`);
        }
        return listing;
    }

    async fetchListingById(id: number) {
        return await this.listing.findByPk(id);
    }

    async fetchListingByAsin(asinId: number) {
        return await this.listing.findOne({
            where: {asinId: asinId}
        });
    }
    
    getListing() {
        return this.listing;
    }
}
