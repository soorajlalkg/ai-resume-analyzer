import { RequestHandler, Router } from 'express';

import { ResumeController } from '../../controllers/resumeController';
import auth from '../../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Resume
 *   description: Resume related routes
 */

/**
 * @swagger
 * /api/v1/resume/upload:
 *   post:
 *     summary: Upload resume
 *     description: Upload resume to the specified folder.
 *     security:
 *       - bearerAuth: []
 *     tags: [Resume]
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

router.post('/upload', auth, ResumeController.uploadResume as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/resume:
 *   get:
 *     summary: Get resumes
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user resumes
 */
router.get('', auth, ResumeController.getResumes as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/resume/{resumeId}:
 *   post:
 *     summary: Get Resume by Id
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume fetched successfully
 *       400:
 *         description: Bad request (not found)
 */
router.get('/:resumeId', auth, ResumeController.getResume as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/resume/{resumeId}/ats-score:
 *   post:
 *     summary: Get ATS score
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Score fetched successfully
 *       400:
 *         description: Bad request (not found)
 */
router.post(
  '/:resumeId/ats-score',
  auth,
  ResumeController.generateAtsScore as unknown as RequestHandler,
);

export default router;
