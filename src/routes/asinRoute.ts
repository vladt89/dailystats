import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /asins:
 *   get:
 *     summary: Get all asins
 *     description: Retrieve a list of all asins.
 *     responses:
 *       200:
 *         description: A list of asins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   asin:
 *                     type: string
 *                   brandId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date
 *                   updatedAt:
 *                     type: string
 *                     format: date
 */
router.get('/asins', (req, res) => {
    res.json([{ id: 1, asin: 'ASIN_ASICS', brandId: 1, createdAt: new Date(), updatedAt: new Date() }]);
});

export default router;
