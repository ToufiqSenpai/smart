import { Router } from 'express';
import * as announcementController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticate, announcementController.list);
router.post('/', authenticate, authorize('OFFICER', 'CHAIRPERSON'), announcementController.create);
router.get('/:announcementId', authenticate, announcementController.getById);
router.patch('/:announcementId', authenticate, authorize('OFFICER', 'CHAIRPERSON'), announcementController.update);
router.delete('/:announcementId', authenticate, authorize('OFFICER', 'CHAIRPERSON'), announcementController.remove);

export default router;
