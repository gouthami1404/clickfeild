import { processUpload } from '../services/uploadService.js';

export async function uploadFiles(req, res, next) {
  try {
    const files = req.files;
    const clientName = req.body?.clientName || req.body?.name || 'New Client';

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const result = await processUpload(files, clientName);
    
    res.status(201).json({
      success: true,
      client: result.client,
      documents: result.documents,
      combinedText: result.combinedText
    });
  } catch (error) {
    next(error);
  }
}
