import { Router } from 'express';
import type { RequestHandler } from 'express';
import { uploadController } from '../../controllers/uploadController';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/', auth, uploadController.handleFileUpload as unknown as RequestHandler);

router.delete('/:key', auth, uploadController.handleFileDelete as unknown as RequestHandler);

export default router;
