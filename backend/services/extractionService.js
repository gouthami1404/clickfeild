import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import { extractTextFromPdf as extractPdfViaGemini } from './geminiService.js';

const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }
  const fileType = ALLOWED_TYPES[file.mimetype] || getExtensionFromName(file.originalname);
  if (!fileType) {
    throw new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, DOCX, MP3, WAV`);
  }
  return fileType;
}

function getExtensionFromName(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  const extMap = { pdf: 'pdf', docx: 'docx', doc: 'docx', mp3: 'mp3', wav: 'wav', m4a: 'm4a' };
  return extMap[ext] || null;
}

export async function extractTextFromPdf(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || '';
  } catch (err) {
    const isParseError = /bad XRef|invalid|xref|corrupted/i.test(err?.message || '');
    if (isParseError && process.env.GEMINI_API_KEY) {
      try {
        return await extractPdfViaGemini(filePath);
      } catch (geminiErr) {
        console.warn('Gemini PDF fallback failed:', geminiErr?.message);
      }
    }
    const msg = err?.message || String(err);
    throw new Error(`PDF extraction failed: ${msg}. The file may be corrupted, password-protected, or in an unsupported format.`);
  }
}

export async function extractTextFromDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  } catch (err) {
    const msg = err?.message || String(err);
    throw new Error(`DOCX extraction failed: ${msg}`);
  }
}

export async function extractTextFromFile(filePath, fileType) {
  switch (fileType) {
    case 'pdf':
      return extractTextFromPdf(filePath);
    case 'docx':
      return extractTextFromDocx(filePath);
    case 'mp3':
    case 'wav':
    case 'webm':
    case 'ogg':
    case 'm4a':
      return null; // Audio - handled by Gemini service
    default:
      throw new Error(`Unsupported file type for extraction: ${fileType}`);
  }
}
