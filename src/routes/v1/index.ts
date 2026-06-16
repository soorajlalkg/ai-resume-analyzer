import { Router } from 'express';

import authRoute from './authRoutes';
import userRoute from './userRoute';
import uploadRoute from './uploadRoute';
import resumeRoute from './resumeRoutes';
import jobDescriptionRoute from './jobDescriptionRoutes';
import analysisRoute from './analysisRoute';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/upload', uploadRoute);
router.use('/resume', resumeRoute);
router.use('/job-description', jobDescriptionRoute);
router.use('/analysis', analysisRoute);

export default router;
