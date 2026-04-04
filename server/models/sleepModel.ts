import pool from '../config/db';

export const createSleepTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS sleep_records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      duration FLOAT NOT NULL, -- in hours
      quality INT NOT NULL, -- 1-10
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await pool.query(query);
};

export const addSleepRecord = async (userId: number, duration: number, quality: number, date: string) => {
  const [result]: any = await pool.query(
    'INSERT INTO sleep_records (user_id, duration, quality, date) VALUES (?, ?, ?, ?)',
    [userId, duration, quality, date]
  );
  return result.insertId;
};

export const getSleepHistoryByUserId = async (userId: number) => {
  const [rows] = await pool.query('SELECT * FROM sleep_records WHERE user_id = ? ORDER BY date DESC', [userId]);
  return rows;
};
