import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.get('/me', authenticateToken as any, getMe as any);

export default router;
