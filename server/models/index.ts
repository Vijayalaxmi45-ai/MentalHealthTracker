import { createUserTable } from './userModel';
import { createMoodTable } from './moodModel';
import { createJournalTable } from './journalModel';
import { createStressTable } from './stressModel';
import { createSleepTable } from './sleepModel';

export const initDB = async () => {
  try {
    await createUserTable();
    await createMoodTable();
    await createJournalTable();
    await createStressTable();
    await createSleepTable();
    console.log('Database tables initialized successfully!');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};
