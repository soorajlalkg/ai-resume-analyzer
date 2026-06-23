import { RequestHandler, Router } from 'express';

import { JobsController } from '../../controllers/jobsController';
import auth from '../../middlewares/auth';
import authAdmin from '../../middlewares/authAdmin';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Jobs related routes
 */

/**
 * @swagger
 * /api/v1/jobs/matches:
 *   get:
 *     summary: Get matched jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Jobs list successful
 * */
router.get('/matches', auth, JobsController.matchedJobs as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/jobs/{jobId}/matched-resumes:
 *   post:
 *     summary: Get matched resumes (Admin Only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Resumes fetched successfully
 *       400:
 *         description: Bad request (not found)
 */
router.get(
  '/:jobId/matched-resumes',
  auth,
  authAdmin,
  JobsController.matchedResumes as unknown as RequestHandler,
);

export default router;
