import sqlite3 from 'sqlite3';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

sqlite3.verbose();
const db = new sqlite3.Database(join(process.cwd(), 'propertyagent.db'));

export function run(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err); else resolve();
    });
  });
}

export function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err); else resolve(rows as T[]);
    });
  });
}

export async function init() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const schemaPath = join(__dirname, 'schema.sql');
  const schema = await readFile(schemaPath, 'utf8');
  await run('PRAGMA journal_mode = WAL;');
  await new Promise<void>((resolve, reject) => {
    db.exec(schema, err => (err ? reject(err) : resolve()));
  });
}

export { db };
