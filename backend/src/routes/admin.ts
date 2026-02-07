import { Router } from 'express';
import { requireRole } from '../middleware/roles';
import { createStudent, markAttendance, dailySummary, studentAnalytics, listStudents, updateStudent, deleteStudent, weeklySummary, monthlySummary } from '../controllers/adminController';

const router = Router();

router.use(requireRole('admin'));
router.post('/students', createStudent);
router.get('/students', listStudents);
router.put('/students/:studentId', updateStudent);
router.delete('/students/:studentId', deleteStudent);
router.post('/attendance/mark', markAttendance);
router.get('/analytics/daily', dailySummary);
router.get('/analytics/student/:studentId', studentAnalytics);
router.get('/analytics/weekly', weeklySummary);
router.get('/analytics/monthly', monthlySummary);

export default router;
