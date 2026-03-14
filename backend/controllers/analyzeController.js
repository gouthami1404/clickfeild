import pool from '../database/connection.js';
import { analyzeBusinessText } from '../services/geminiService.js';

export async function analyzeClient(req, res, next) {
  try {
    const { clientId } = req.params;

    const docsResult = await pool.query(
      'SELECT extracted_text FROM documents WHERE client_id = $1 ORDER BY uploaded_at',
      [clientId]
    );

    const combinedText = docsResult.rows.map(r => r.extracted_text).filter(Boolean).join('\n\n');

    const analysis = await analyzeBusinessText(combinedText);

    const insertResult = await pool.query(
      `INSERT INTO analysis (client_id, business_model, industry, ideal_customer, goals, problems, opportunities)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        clientId,
        analysis.business_model,
        analysis.industry,
        analysis.ideal_customer,
        analysis.goals,
        analysis.problems,
        analysis.opportunities
      ]
    );

    res.json({
      success: true,
      analysis: insertResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
}
