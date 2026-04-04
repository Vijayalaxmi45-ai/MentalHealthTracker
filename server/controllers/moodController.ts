import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { addMood, getMoodsByUserId } from '../models/moodModel';

export const postMood = async (req: AuthRequest, res: Response) => {
  try {
    const { mood, mood_score, note, date } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const insertId = await addMood(userId, mood, mood_score, note, date || new Date().toISOString().split('T')[0]);
    res.status(201).json({ message: 'Mood recorded', id: insertId });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMoodHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const history = await getMoodsByUserId(userId);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
