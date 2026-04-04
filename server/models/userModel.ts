import pool from '../config/db';

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

export const findUserByEmail = async (email: string) => {
  const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async (name: string, email: string, passwordHash: string) => {
  const [result]: any = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result.insertId;
};
