import { Router } from 'express';
import * as businessController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticate, businessController.list);
router.post('/', authenticate, authorize('RESIDENT', 'OFFICER', 'CHAIRPERSON'), businessController.create);
router.get('/me', authenticate, businessController.getMyBusinesses);
router.get('/:businessId', authenticate, businessController.getById);
router.patch('/:businessId', authenticate, businessController.update);
router.patch('/:businessId/status', authenticate, authorize('OFFICER', 'CHAIRPERSON'), businessController.validateStatus);

export default router;
