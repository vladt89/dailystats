import express, {Request, Response} from 'express';
import initializeServices, {asinService, brandService, listingService, statsService} from "./serviceInitializer";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import brandRoute from "./routes/brandRoute";

const app = express();
const port = 3333;

const CREATE_SOME_DATA = process.env.CREATE_SOME_DATA === 'true';

app.use(express.json());

const swaggerOptions: swaggerJsdoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API Documentation for My Express App',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', brandRoute);

app.get('/brands', async (req: Request, res: Response) => {
    const brands = await brandService.fetchAllBrands();
    res.json(brands);
});

app.post('/brands/:brandName', async (req: Request, res: Response) => {
    let brand;
    try {
        brand = await brandService.addBrand(req.params.brandName);
    } catch (e: any) {
        res.status(400).json(e.message);
    }
    res.status(201).json(brand);
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
        res.status(404).json({error: `ASIN with value ${asin} and correlated brand id is not found`});
        return;
    }
    
    const listing = await listingService.fetchListingByAsin(asinData.id);
    if (listing === null) {
        res.status(404).json({error: `Listing for asin ${asin} is not found`});
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

export const startServer = async () => {
    try {
        await initializeServices(CREATE_SOME_DATA);
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (e) {
        console.error('Failed to initialize services');
        process.exit(1);
    }
};

export default app;
