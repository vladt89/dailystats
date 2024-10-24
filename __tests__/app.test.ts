import request from 'supertest';
import app from "../src/app";
import {brandService} from "../src/serviceInitializer";

describe('GET /brands', () => {
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
