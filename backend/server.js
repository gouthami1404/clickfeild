import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import uploadRoutes from './routes/upload.js';
import analyzeRoutes from './routes/analyze.js';
import clientRoutes from './routes/clients.js';

dotenv.config();

function getErrorMessage(err) {
  if (typeof err === 'string') return err;
  if (err?.code === 'ECONNREFUSED' || err?.errno === -4078) {
    return 'Database connection refused. Ensure PostgreSQL is running and DATABASE_URL is correct.';
  }
  if (err?.errors?.[0]?.message) return getErrorMessage(err.errors[0]);
  if (err?.message) return err.message;
  if (err?.detail) return err.detail;
  return 'Internal server error';
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api', uploadRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', clientRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const pool = (await import('./database/connection.js')).default;
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: getErrorMessage(err),
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  const message = getErrorMessage(err);
  res.status(status).json({ error: message });
});

async function startup() {
  if (!process.env.DATABASE_URL) {
    console.error('\n⚠ DATABASE_URL is not set. Copy backend/.env.example to backend/.env and configure it.\n');
  }
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠ GEMINI_API_KEY is not set. Audio transcription and AI analysis will fail.');
  }
}

startup().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
