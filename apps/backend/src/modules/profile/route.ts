import { Router } from 'express';
import * as profileController from './controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, profileController.getProfile);
router.patch('/me', authenticate, profileController.updateProfile);

export default router;
