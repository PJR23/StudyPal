import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('flashcards.db');

const setupDatabase = async () => {
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT,
      answer TEXT,
      set_id INTEGER,
      FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS flashcard_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flashcard_id INTEGER,
      set_id INTEGER,
      FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE,
      FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS starred_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      set_id INTEGER UNIQUE,
      FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
    );
  `);
};

export const toggleStarredSet = async (setId, starred) => {
  try {
    const db = await dbPromise;
    if (starred) {
      await db.runAsync('INSERT OR IGNORE INTO starred_sets (set_id) VALUES (?)', [setId]);
    } else {
      await db.runAsync('DELETE FROM starred_sets WHERE set_id = ?', [setId]);
    }
  } catch (error) {
    console.error('Error toggling starred set:', error);
    throw error;
  }
};

export const getStarredSets = async () => {
  try {
    const db = await dbPromise;
    const allRows = await db.getAllAsync('SELECT set_id FROM starred_sets');
    const starredSets = {};
    allRows.forEach((row) => {
      starredSets[row.set_id] = true;
    });
    return starredSets;
  } catch (error) {
    console.error('Error fetching starred sets:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    await setupDatabase();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const getCards = async (setId) => {
  try {
    const db = await dbPromise;
    const allRows = await db.getAllAsync('SELECT * FROM flashcards WHERE set_id = ?', [setId]);
    return allRows;
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
};

export async function getCardById(cardId) {
  const db = await dbPromise;
  const card = await db.getAllAsync(`SELECT * FROM flashcards WHERE id = ?`, [cardId]);
  return card;
}

export const saveCard = async (question, answer, setId) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'INSERT INTO flashcards (question, answer, set_id) VALUES (?, ?, ?)', 
      [question, answer, setId]
    );
    const allRows = await getCards(setId);
    return allRows;
  } catch (error) {
    console.error("Error saving card:", error);
    throw error;
  }
};


export const updateCard = async (id, question, answer) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?', 
      [question, answer, id]
    );
    const allRows = await db.getAllAsync('SELECT * FROM flashcards');
    return allRows;
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
};

export const deleteCard = async (id) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'DELETE FROM flashcards WHERE id = ?', 
      [id]
    );
    const allRows = await db.getAllAsync('SELECT * FROM flashcards');
    return allRows;
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};


export const createSet = async (name, category, callback) => {
  try {
    const db = await dbPromise;
    const result = await db.runAsync(
      'INSERT INTO sets (name, category) VALUES (?, ?)',
      [name, category]
    );

    const setId = result.insertId;
    const allRows = await db.getAllAsync('SELECT * FROM sets');
    callback(allRows, setId);
  } catch (error) {
    console.error("Error creating set:", error);
  }
};


export const getSets = async (callback) => {
  try {
    const db = await dbPromise;
    const allRows = await db.getAllAsync('SELECT * FROM sets');
    callback(allRows);
  } catch (error) {
    console.error("Error fetching sets:", error);
  }
};

export const editSet = async (setId, name, category, callback) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'UPDATE sets SET name = ?, category = ? WHERE id = ?', 
      [name, category, setId]
    );

    const allRows = await db.getAllAsync('SELECT * FROM sets');
    callback(allRows);
  } catch (error) {
    console.error("Error updating set:", error);
  }
};

export const deleteSet = async (setId, callback) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'DELETE FROM sets WHERE id = ?', 
      [setId]
    );

    const allRows = await db.getAllAsync('SELECT * FROM sets');
    callback(allRows);
  } catch (error) {
    console.error("Error deleting set:", error);
  }
};

export const updateSet = async (setId, name, category) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      'UPDATE sets SET name = ?, category = ? WHERE id = ?', 
      [name, category, setId]
    );

    const allRows = await db.getAllAsync('SELECT * FROM sets');
    return allRows;
  } catch (error) {
    console.error("Error updating set:", error);
    throw error;
  }
};
