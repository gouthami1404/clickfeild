import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const ANALYSIS_PROMPT = `Analyze the following business onboarding information and extract key insights.

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "business_model": "string",
  "industry": "string",
  "ideal_customer": "string",
  "goals": "string",
  "problems": "string",
  "opportunities": "string"
}

Business information to analyze:
`;

const AUDIO_TRANSCRIPT_PROMPT = 'Transcribe this audio accurately. Return only the transcribed text, no additional commentary.';

export async function analyzeBusinessText(text) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  if (!text || text.trim().length === 0) {
    return {
      business_model: '',
      industry: '',
      ideal_customer: '',
      goals: '',
      problems: '',
      opportunities: ''
    };
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const prompt = ANALYSIS_PROMPT + text;
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  const output = response.text();

  return parseGeminiJson(output);
}

const PDF_EXTRACT_PROMPT = 'Extract all text from this PDF document. Return only the extracted text, preserving structure where possible. Do not add any commentary or formatting.';

export async function extractTextFromPdf(filePath) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const fileData = await fs.readFile(filePath);
  const base64 = fileData.toString('base64');

  const parts = [
    { text: PDF_EXTRACT_PROMPT },
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: base64
      }
    }
  ];

  const result = await model.generateContent(parts);
  const response = result.response;
  return response.text() || '';
}

export async function transcribeAudio(filePath, mimeType) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const fileData = await fs.readFile(filePath);
  const base64 = fileData.toString('base64');

  const parts = [
    { text: AUDIO_TRANSCRIPT_PROMPT },
    {
      inlineData: {
        mimeType: mimeType || 'audio/mp3',
        data: base64
      }
    }
  ];

  const result = await model.generateContent(parts);
  const response = result.response;
  return response.text() || '';
}

function parseGeminiJson(output) {
  try {
    let cleaned = output.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    }
    const parsed = JSON.parse(cleaned);
    return {
      business_model: parsed.business_model || '',
      industry: parsed.industry || '',
      ideal_customer: parsed.ideal_customer || '',
      goals: parsed.goals || '',
      problems: parsed.problems || '',
      opportunities: parsed.opportunities || ''
    };
  } catch (e) {
    console.error('Failed to parse Gemini JSON:', output);
    return {
      business_model: '',
      industry: '',
      ideal_customer: '',
      goals: '',
      problems: '',
      opportunities: ''
    };
  }
}
