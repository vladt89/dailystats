import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get all listings
 *     description: Retrieve a list of all listings.
 *     responses:
 *       200:
 *         description: A list of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   marketplace:
 *                     type: string
 *                   listingId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date
 *                   updatedAt:
 *                     type: string
 *                     format: date
 
 */
router.get('/listings', (req, res) => {
    res.json([{ id: 1, marketplace: 'amazon', listingId: 1 }]);
});

export default router;
