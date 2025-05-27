import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = '/data/wahlstimmen.db'; // Fly.io Volume-Pfad

let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });

    // Tabelle erstellen, falls nicht vorhanden
    await db.run(`
      CREATE TABLE IF NOT EXISTS eintraege (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        briefwahl TEXT NOT NULL,
        zeitpunkt TEXT NOT NULL
      )
    `);
  }
  return db;
}

export async function addEntry(name, briefwahl) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.run(
    'INSERT INTO eintraege (name, briefwahl, zeitpunkt) VALUES (?, ?, ?)',
    [name.trim(), briefwahl, now]
  );
}

export async function getEntries() {
  const db = await getDb();
  return await db.all('SELECT * FROM eintraege ORDER BY zeitpunkt DESC');
}

export async function deleteEntry(id) {
  const db = await getDb();
  await db.run('DELETE FROM eintraege WHERE id = ?', [id]);
}

export async function getAdminStats() {
  const db = await getDb();
  const rows = await db.all(`
    SELECT name,
           SUM(CASE WHEN briefwahl = 'ja' THEN 1 ELSE 0 END) AS mitBriefwahl,
           SUM(CASE WHEN briefwahl = 'nein' THEN 1 ELSE 0 END) AS ohneBriefwahl,
           COUNT(*) AS gesamt
    FROM eintraege
    GROUP BY name
  `);
  return rows;
}
