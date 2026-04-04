import pool from '../config/db';

export const createStressTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stress_levels (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      level INT NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await pool.query(query);
};

export const addStressLevel = async (userId: number, level: number, date: string) => {
  const [result]: any = await pool.query(
    'INSERT INTO stress_levels (user_id, level, date) VALUES (?, ?, ?)',
    [userId, level, date]
  );
  return result.insertId;
};

export const getStressHistoryByUserId = async (userId: number) => {
  const [rows] = await pool.query('SELECT * FROM stress_levels WHERE user_id = ? ORDER BY date DESC', [userId]);
  return rows;
};
