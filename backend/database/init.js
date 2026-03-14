import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('Database schema initialized successfully.');
  } catch (error) {
    const code = error?.code || error?.errors?.[0]?.code;
    const msg = error?.message || error?.errors?.[0]?.message || String(error);
    console.error('Failed to initialize database:', msg || 'Unknown error');
    if (code === 'ECONNREFUSED') {
      console.error('→ Ensure PostgreSQL is running. Start it via Windows Services or: pg_ctl start');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
