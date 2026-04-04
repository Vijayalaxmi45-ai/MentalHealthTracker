import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { addJournalEntry, getJournalEntriesByUserId } from '../models/journalModel';

export const postJournal = async (req: AuthRequest, res: Response) => {
  try {
    const { content, date } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const insertId = await addJournalEntry(userId, content, date || new Date().toISOString().split('T')[0]);
    res.status(201).json({ message: 'Journal entry saved', id: insertId });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getJournalHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const entries = await getJournalEntriesByUserId(userId);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
