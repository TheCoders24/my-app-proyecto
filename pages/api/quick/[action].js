import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  const { action } = req.query;
  const { cantidad } = req.body;

  try {
    // Ejemplo para entrada rápida
    if (action === 'entrada') {
      await pool.query(
        `UPDATE productos 
        SET stock = stock + $1 
        WHERE id = 1`, // ID de ejemplo
        [cantidad]
      );
      return res.status(200).json({ success: true });
    }

    // Implementar otras acciones...

    res.status(400).json({ error: 'Acción no válida' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}