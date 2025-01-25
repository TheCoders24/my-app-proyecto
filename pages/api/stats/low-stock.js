// pages/api/stats/low-stock.js
import { query } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { rows } = await query('SELECT COUNT(*) as count FROM productos WHERE stock < 10');
    res.status(200).json({ count: rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}