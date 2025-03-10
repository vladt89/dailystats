import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     description: Retrieve a list of all brands.
 *     responses:
 *       200:
 *         description: A list of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   brandName:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date
 *                   updatedAt:
 *                     type: string
 *                     format: date
 */
router.get('/brands', (req, res) => {
    res.json([{ id: 1, brandName: 'Asics', createdAt: new Date(), updatedAt: new Date() }]);
});

export default router;
