// pages/api/movements/recent.js
import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM vista_movimientos 
      ORDER BY fecha DESC 
      LIMIT 5
    `);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}