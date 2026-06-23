import { RequestHandler, Router } from 'express';

import { JobDescriptionController } from '../../controllers/jobDescriptionController';
import auth from '../../middlewares/auth';
import authAdmin from '../../middlewares/authAdmin';

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
 *     summary: Add JD  (Admin Only)
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
router.post('/', auth, authAdmin, JobDescriptionController.create as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/job-description:
 *   get:
 *     summary: Get JD list
 *     tags: [Job Description]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved JD
 */
router.get('/', auth, JobDescriptionController.getAll as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/job-description/{jobId}:
 *   post:
 *     summary: Get JD
 *     tags: [Job Description]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: JD fetched successfully
 *       400:
 *         description: Bad request (not found)
 */
router.get(
  '/:jobDescriptionId',
  auth,
  JobDescriptionController.getById as unknown as RequestHandler,
);

router.delete(
  '/:jobDescriptionId',
  auth,
  authAdmin,
  JobDescriptionController.delete as unknown as RequestHandler,
);

export default router;
