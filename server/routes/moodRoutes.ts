import express from 'express';
import { postMood, getMoodHistory } from '../controllers/moodController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken as any);
router.post('/', postMood as any);
router.get('/history', getMoodHistory as any);

export default router;
