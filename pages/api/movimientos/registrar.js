import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { producto_id, tipo, cantidad, usuario_id } = req.body;
    
    try {
      await pool.query('BEGIN');
      
      // Registrar movimiento
      const movimiento = await pool.query(
        `INSERT INTO movimientos 
        (producto_id, tipo, cantidad, usuario_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [producto_id, tipo, cantidad, usuario_id]
      );

      // Actualizar stock
      const operacion = tipo === 'entrada' ? '+' : '-';
      await pool.query(
        `UPDATE productos 
        SET stock = stock ${operacion} $1 
        WHERE id = $2`,
        [cantidad, producto_id]
      );

      await pool.query('COMMIT');
      res.status(201).json(movimiento.rows[0]);
    } catch (error) {
      await pool.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}