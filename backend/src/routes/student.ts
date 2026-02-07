import { Router } from 'express';
import { requireRole } from '../middleware/roles';
import { myAttendance, myAnalytics } from '../controllers/studentController';

const router = Router();
router.use(requireRole('student'));

router.get('/attendance', myAttendance);
router.get('/analytics', myAnalytics);

export default router;
