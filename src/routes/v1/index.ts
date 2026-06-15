import { Router } from 'express';

import authRoute from './authRoutes';
import userRoute from  './userRoute';
import uploadRoute from  './uploadRoute';
import resumeRoute from  './resumeRoutes';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/upload', uploadRoute);
router.use('/resume', resumeRoute);

export default router;
