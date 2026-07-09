import { Router } from 'express';
import issueRoutes from './modules/issues/route.js';
import profileRoutes from './modules/profile/route.js';
import residentRoutes from './modules/residents/route.js';
import announcementRoutes from './modules/announcement/route.js';
import businessRoutes from './modules/businesses/route.js';

const router = Router();

router.use('/issues', issueRoutes);
router.use('/profile', profileRoutes);
router.use('/residents', residentRoutes);
router.use('/announcements', announcementRoutes);
router.use('/businesses', businessRoutes);

export default router;
