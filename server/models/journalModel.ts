import pool from '../config/db';

export const createJournalTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS journal (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      mood_id INT,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await pool.query(query);
};

export const addJournalEntry = async (userId: number, content: string, date: string) => {
  const [result]: any = await pool.query(
    'INSERT INTO journal (user_id, content, date) VALUES (?, ?, ?)',
    [userId, content, date]
  );
  return result.insertId;
};

export const getJournalEntriesByUserId = async (userId: number) => {
  const [rows] = await pool.query('SELECT * FROM journal WHERE user_id = ? ORDER BY date DESC', [userId]);
  return rows;
};
