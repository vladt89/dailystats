import request from 'supertest';
import app from "../app";
import {asinService, brandService, listingService, statsService} from "../serviceInitializer";

describe('test brands', () => {
    beforeAll(async () => {
       await brandService.removeAllBrands(); 
    });
    
    it('should succeed with empty database', async () => {
        const response = await request(app).get('/brands');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });

    it('should succeed with one brand', async () => {
        const newBrand = 'FascinatingBrand';
        const postResponse = await request(app).post('/brands/' + newBrand);
        expect(postResponse.status).toBe(201);
        expect(postResponse.body.brandName).toBe(newBrand);

        const getResponse = await request(app).get('/brands');
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.length).toBe(1);
    });
});

describe('test statistics', () => {
    beforeEach(async () => {
        await brandService.removeAllBrands();
    });

    it('should fail to find pure dailyStats', async () => {
        const getResponse = await request(app).get('/statistics');
        expect(getResponse.status).toBe(404);
    });

    it('should fail to find statistics because of missing brand', async () => {
        const brandName = 'FunBrand';
        const getResponse = await request(app).get('/statistics/' + brandName + '/UYTR123/2020-10-10');
        expect(getResponse.status).toBe(404);
        expect(getResponse.body.error).toBe(`Brand with name ${brandName} is not found`);
    });

    it('should fail to find statistics because of missing asin', async () => {
        const brandName = 'FunBrand';
        await request(app).post('/brands/' + brandName);
        const asin = 'UYTR123';
        // EXERCISE
        const getResponse = await request(app).get('/statistics/' + brandName + '/' + asin + '/2020-10-10');
        // VERIFY
        expect(getResponse.status).toBe(404);
        expect(getResponse.body.error).toBe(`ASIN with value ${asin} and correlated brand id is not found`);
    });

    it('should fail to find statistics because of missing asin', async () => {
        const brandName = 'FunBrand';
        const brand = await request(app).post('/brands/' + brandName);
        const asin = 'UYTR123';
        await asinService.addAsin(asin, brand.body.id);
        // EXERCISE
        const getResponse = await request(app).get('/statistics/' + brandName + '/' + asin + '/2020-10-10');
        // VERIFY
        expect(getResponse.status).toBe(404);
        expect(getResponse.body.error).toBe(`Listing for asin ${asin} is not found`);
    });

    it('should fail to find statistics because of wrong date format', async () => {
        const brandName = 'FunBrand';
        const brand = await request(app).post('/brands/' + brandName);
        const asin = 'UYTR123';
        const asinData = await asinService.addAsin(asin, brand.body.id);
        if (asinData !== undefined) {
            await listingService.addListing("FunMarketplace", asinData.id);
        }
        // EXERCISE
        const getResponse = await request(app).get('/statistics/' + brandName + '/' + asin + '/2020-20-20');
        // VERIFY
        expect(getResponse.status).toBe(400);
        expect(getResponse.body.error).toBe(`Parameter day has a wrong type`);
    });

    it('should succeed, but get no results', async () => {
        const brandName = 'FunBrand';
        const brand = await request(app).post('/brands/' + brandName);
        const asin = 'UYTR123';
        const asinData = await asinService.addAsin(asin, brand.body.id);
        let listing;
        if (asinData !== undefined) {
            listing = await listingService.addListing("FunMarketplace", asinData.id);
        }
        if (listing !== undefined) {
            await statsService.createStats({clickAmount: 50, viewTimeSec: 3000, createdAt: "2020-10-10", listingId: listing.id});
        }
        // EXERCISE
        const getResponse = await request(app).get('/statistics/' + brandName + '/' + asin + '/2020-10-20');
        // VERIFY
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toStrictEqual([]);
    });

    it('should succeed and get no results', async () => {
        const brandName = 'FunBrand';
        const brand = await request(app).post('/brands/' + brandName);
        const asin = 'UYTR123';
        const asinData = await asinService.addAsin(asin, brand.body.id);
        let listing;
        if (asinData !== undefined) {
            listing = await listingService.addListing("FunMarketplace", asinData.id);
        }
        const viewTimeSec = 3000;
        const clickAmount = 50;
        if (listing !== undefined) {
            await statsService.createStats({clickAmount, viewTimeSec, listingId: listing.id});
        }
        const formattedDate = new Date().toISOString().split('T')[0];
        // EXERCISE
        const getResponse = await request(app).get('/statistics/' + brandName + '/' + asin + `/${formattedDate}`);
        // VERIFY
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.length).toStrictEqual(1);
        expect(getResponse.body[0].clickAmount).toBe(clickAmount);
        expect(getResponse.body[0].viewTimeSec).toBe(viewTimeSec);
    });
});
