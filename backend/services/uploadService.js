import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import pool from '../database/connection.js';
import { extractTextFromFile, validateFile } from './extractionService.js';
import { transcribeAudio } from './geminiService.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const ALLOWED_AUDIO = ['mp3', 'wav', 'webm', 'ogg', 'm4a'];
const AUDIO_MIME = {
  mp3: 'audio/mp3',
  wav: 'audio/wav',
  webm: 'audio/webm',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4'
};

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function processUpload(files, clientName) {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  const clientResult = await pool.query(
    'INSERT INTO clients (name) VALUES ($1) RETURNING id, name, created_at',
    [clientName || 'New Client']
  );
  const client = clientResult.rows[0];

  const documents = [];
  let combinedText = '';

  for (const file of files) {
    const fileType = validateFile(file);
    
    const ext = path.extname(file.originalname) || `.${fileType}`;
    const saveName = `${randomUUID()}${ext}`;
    const savePath = path.join(UPLOAD_DIR, saveName);
    
    await ensureUploadDir();
    await fs.writeFile(savePath, file.buffer);

    let extractedText = '';
    if (ALLOWED_AUDIO.includes(fileType)) {
      extractedText = await transcribeAudio(savePath, AUDIO_MIME[fileType] || 'audio/mp3');
    } else {
      extractedText = await extractTextFromFile(savePath, fileType);
    }

    await fs.unlink(savePath).catch(() => {});

    const docResult = await pool.query(
      `INSERT INTO documents (client_id, file_name, file_type, extracted_text)
       VALUES ($1, $2, $3, $4) RETURNING id, file_name, file_type, extracted_text, uploaded_at`,
      [client.id, file.originalname, fileType, extractedText || '']
    );
    documents.push(docResult.rows[0]);
    if (extractedText) combinedText += extractedText + '\n\n';
  }

  return { client, documents, combinedText: combinedText.trim() };
}
