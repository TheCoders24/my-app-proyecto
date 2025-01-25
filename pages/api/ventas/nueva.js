import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { usuario_id, total, productos } = req.body;

      // Registrar venta
      const venta = await client.query(
        `INSERT INTO ventas (usuario_id, total) 
        VALUES ($1, $2) 
        RETURNING id`,
        [usuario_id, total]
      );

      // Registrar detalles
      for (const producto of productos) {
        await client.query(
          `INSERT INTO detalle_ventas 
          (venta_id, producto_id, cantidad, precio) 
          VALUES ($1, $2, $3, $4)`,
          [venta.rows[0].id, producto.id, producto.cantidad, producto.precio]
        );

        await client.query(
          `UPDATE productos 
          SET stock = stock - $1 
          WHERE id = $2`,
          [producto.cantidad, producto.id]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({ id: venta.rows[0].id });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}