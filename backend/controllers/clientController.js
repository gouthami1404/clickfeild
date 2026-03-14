import pool from '../database/connection.js';

export async function getClientById(req, res, next) {
  try {
    const { id } = req.params;

    const clientResult = await pool.query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const documentsResult = await pool.query(
      'SELECT id, file_name, file_type, extracted_text, uploaded_at FROM documents WHERE client_id = $1 ORDER BY uploaded_at',
      [id]
    );

    const analysisResult = await pool.query(
      'SELECT * FROM analysis WHERE client_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    const client = clientResult.rows[0];
    const documents = documentsResult.rows;
    const analysis = analysisResult.rows[0] || null;

    res.json({
      client,
      documents,
      analysis
    });
  } catch (error) {
    next(error);
  }
}

export async function getClients(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT c.*, 
        (SELECT json_agg(json_build_object('id', d.id, 'file_name', d.file_name, 'file_type', d.file_type))
         FROM documents d WHERE d.client_id = c.id) as documents,
        (SELECT row_to_json(a) FROM analysis a WHERE a.client_id = c.id ORDER BY a.created_at DESC LIMIT 1) as latest_analysis
       FROM clients c ORDER BY c.created_at DESC`
    );

    res.json({ clients: result.rows });
  } catch (error) {
    next(error);
  }
}
