import express from 'express';
import { postJournal, getJournalHistory } from '../controllers/journalController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken as any);
router.post('/', postJournal as any);
router.get('/history', getJournalHistory as any);

export default router;
