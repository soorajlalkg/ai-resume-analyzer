import { RequestHandler, Router } from 'express';

import { JobDescriptionController } from '../../controllers/jobDescriptionController';
import auth from '../../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Job Description
 *   description: Job Description related routes
 */

/**
 * @swagger
 * /api/v1/job-description:
 *   post:
 *     summary: Add JD
 *     tags: [Job Description]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - companyName
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               companyName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: JD creation successful
 */
router.post('/', auth, JobDescriptionController.create as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/job-description/upload:
 *   post:
 *     summary: Upload JD
 *     description: Upload JD to the specified folder.
 *     security:
 *       - bearerAuth: []
 *     tags: [Job Description]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully.
 *       400:
 *         description: Bad request.
 */
router.post('/upload', auth, JobDescriptionController.upload as unknown as RequestHandler);

router.get(
  '/:jobDescriptionId',
  auth,
  JobDescriptionController.getById as unknown as RequestHandler,
);

router.delete(
  '/:jobDescriptionId',
  auth,
  JobDescriptionController.delete as unknown as RequestHandler,
);

export default router;
