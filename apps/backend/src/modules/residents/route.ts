import { Router } from 'express';
import * as residentsController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

router.post('/register', residentsController.register);
router.get('/', authenticate, authorize('OFFICER', 'CHAIRPERSON'), residentsController.list);
router.get('/pending-verifications', authenticate, authorize('CHAIRPERSON'), residentsController.getPendingVerifications);
router.get('/officers', authenticate, residentsController.listOfficers);
router.get('/:residentId', authenticate, residentsController.getById);
router.patch('/:residentId', authenticate, residentsController.update);
router.patch('/:residentId/verification-status', authenticate, authorize('CHAIRPERSON'), residentsController.verifyResident);
router.patch('/:residentId/officer-role', authenticate, authorize('CHAIRPERSON'), residentsController.manageOfficerRole);

export default router;
