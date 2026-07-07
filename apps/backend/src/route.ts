import { Router } from 'express';
import issueRoutes from './modules/issues/route.js';

const router = Router();

router.use('/issues', issueRoutes);

export default router;
