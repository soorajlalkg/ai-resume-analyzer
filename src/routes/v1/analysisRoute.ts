import { RequestHandler, Router } from 'express';

import { AnalysisController } from '../../controllers/analysisController';
import auth from '../../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Job Analysis
 *   description: Job Analysis related routes
 */

/**
 * @swagger
 * /api/v1/analysis/match:
 *   post:
 *     summary: Match JD
 *     tags: [Job Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeId
 *               - jobDescriptionId
 *             properties:
 *               resumeId:
 *                 type: string
 *               jobDescriptionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 */

router.post('/match', auth, AnalysisController.matchResume as unknown as RequestHandler);

export default router;
