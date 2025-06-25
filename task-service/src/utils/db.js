const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../data/tasks.db');

const db = new sqlite3.Database(dbPath);

// crea tablas y triggers para tareas si no existen
const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          user_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);
        
        db.run(`
          CREATE TRIGGER IF NOT EXISTS update_task_timestamp
          AFTER UPDATE ON tasks
          BEGIN
            UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
          END;
        `, (triggerErr) => {
          if (triggerErr) reject(triggerErr);
          else resolve();
        });
      });
    });
  });
};

// ejecuta una consulta SQLite y devuelve un array con las filas encontradas
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// 3. Exporta ambas funciones
module.exports = {
  initDb,
  runQuery
};