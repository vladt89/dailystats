import createBrand from "./db/brand";

export class BrandService {
    private brand: ReturnType<typeof createBrand>;
    
    constructor() {
        this.brand = createBrand();
    }
    
    async addBrand(brandName: string) {
        let brand;
        try {
            brand = await this.brand.create({brandName});
        } catch (e: any) {
            console.log(`Failed to add brand ${brandName}: ${e.message}`);
        }
        return brand;
    }

    async fetchAllBrands() {
        return await this.brand.findAll();
    }

    async fetchBrandById(id: number) {
        return await this.brand.findByPk(id);
    }

    async fetchBrandByName(brandName: string) {
        return await this.brand.findOne({
            where: {brandName: brandName}
        });
    }

    getBrand() {
        return this.brand;
    }
}
