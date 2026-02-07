import { Router } from 'express';
import { login, registerStudent } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register-student', registerStudent); // Admin will call this route (protected in admin routes in use)

export default router;
