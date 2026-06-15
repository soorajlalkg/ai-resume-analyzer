import { Router } from 'express';
import type { RequestHandler } from 'express';
import { uploadController } from '../../controllers/uploadController';
import auth from '../../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File uploading  routes
 */

router.post('/', auth, uploadController.handleFileUpload as unknown as RequestHandler);
/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload files
 *     description: Upload multiple files to the specified folder.
 *     security:
 *       - bearerAuth: []
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folderPath:
 *                 type: string
 *                 description: The folder where files should be uploaded.
 *     responses:
 *       200:
 *         description: Files uploaded successfully.
 *       400:
 *         description: Bad request.
 */

router.delete('/:key', auth, uploadController.handleFileDelete as unknown as RequestHandler);
/**
 * @swagger
 * /api/v1/upload/{key}:
 *   delete:
 *     summary: Delete a file
 *     description: Delete a file from the storage by its key.
 *     security:
 *       - bearerAuth: []
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique key of the file to delete.
 *     responses:
 *       200:
 *         description: File deleted successfully.
 *       400:
 *         description: Bad request.
 */

export default router;
