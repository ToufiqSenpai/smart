import { Router } from 'express';
import * as issueController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('OFFICER', 'CHAIRPERSON'), issueController.list);
router.post('/', authenticate, authorize('RESIDENT'), issueController.create);
router.get('/me', authenticate, authorize('RESIDENT'), issueController.getMyIssues);
router.get('/:issueId', authenticate, issueController.getById);
router.patch('/:issueId', authenticate, issueController.update);
router.patch('/:issueId/status', authenticate, authorize('OFFICER', 'CHAIRPERSON'), issueController.updateStatus);
router.patch('/:issueId/follow-up', authenticate, authorize('OFFICER', 'CHAIRPERSON'), issueController.followUp);

export default router;
