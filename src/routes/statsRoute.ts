import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /statistics/{brand}/{asin}/{day}:
 *   get:
 *     summary: Get all statistics by brand and asin
 *     parameters:
 *        - name: brand
 *          in: path
 *          required: true
 *          description: The brand name
 *          schema:
 *            type: string
 *        - name: asin
 *          in: path
 *          required: true
 *          description: The ASIN (Amazon Standard Identification Number)
 *          schema:
 *            type: string
 *        - name: day
 *          in: path
 *          required: true
 *          description: The day in YYYY-MM-DD format
 *          schema:
 *            type: string
 *            format: date
 *     description: Retrieve a list of daily statistics.
 *     responses:
 *       200:
 *         description: Daily statistics by brand and asin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   clickAmount:
 *                     type: integer
 *                   viewTimeSec:
 *                     type: integer
 */
router.get('/statistics/:brand/:asin/:day', (req, res) => {
    res.json([{ id: 1, clickAmount: 50, viewTimeSec: 3000 }]);
});

/**
 * @swagger
 * /statistics:
 *   post:
 *     summary: Add new statistics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clickAmount:
 *                 type: integer
 *               viewTimeSec:
 *                 type: integer
 *               listingId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Statistics created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     clickAmount:
 *                       type: integer
 *                     viewTimeSec:
 *                       type: integer
 *                     listingId:
 *                       type: integer
 *                     date:
 *                       type: string
 *                       format: date
 */
router.post('/statistics', (req, res) => {
    const { clickAmount, viewTimeSec, listingId, date } = req.body;
    
    res.status(201).json({
        message: 'Statistics added successfully',
        data: { clickAmount, viewTimeSec, listingId, date },
    });
});

export default router;
