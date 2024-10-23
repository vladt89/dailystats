import createAsin from "./db/asin";

export class AsinService {
    private asin: ReturnType<typeof createAsin>;
    
    constructor() {
        this.asin = createAsin();
    }
    
    async addAsin(asinValue: string, brandId: number) {
        let asin;
        try {
            asin = await this.asin.create({asin: asinValue, brandId: brandId});
        } catch (e: any) {
            console.log(`Failed to add asin ${asinValue}: ${e.message}`);
        }
        return asin;
    }

    async fetchAllAsins() {
        return await this.asin.findAll();
    }

    async fetchAsinById(id: number) {
        return await this.asin.findByPk(id);
    }

    getAsin() {
        return this.asin;
    }

    async fetchAsinByAsinAndBrandId(asin: string, brandId: number) {
        return await this.asin.findOne({
            where: {
                brandId: brandId,
                asin: asin
            }
        });       
    }
}
