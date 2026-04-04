import pool from '../config/db';

export const createMoodTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS moods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      mood VARCHAR(255) NOT NULL,
      mood_score INT NOT NULL,
      note TEXT,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await pool.query(query);
};

export const addMood = async (userId: number, mood: string, moodScore: number, note: string, date: string) => {
  const [result]: any = await pool.query(
    'INSERT INTO moods (user_id, mood, mood_score, note, date) VALUES (?, ?, ?, ?, ?)',
    [userId, mood, moodScore, note, date]
  );
  return result.insertId;
};

export const getMoodsByUserId = async (userId: number) => {
  const [rows] = await pool.query('SELECT * FROM moods WHERE user_id = ? ORDER BY date DESC', [userId]);
  return rows;
};
