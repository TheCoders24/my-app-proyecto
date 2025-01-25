// pages/api/stats/products.js
import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const { rows } = await query('SELECT SUM(stock) as total FROM productos');
    res.status(200).json({ total: rows[0].total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}