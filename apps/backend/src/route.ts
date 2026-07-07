import { Router } from 'express';
import issueRoutes from './modules/issues/route.js';
import profileRoutes from './modules/profile/route.js';

const router = Router();

router.use('/issues', issueRoutes);
router.use('/profile', profileRoutes);

export default router;
