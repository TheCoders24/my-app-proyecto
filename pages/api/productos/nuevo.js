import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, descripcion, precio, stock, categoria_id, proveedor_id } = req.body;
    
    try {
      const result = await pool.query(
        `INSERT INTO productos 
        (nombre, descripcion, precio, stock, categoria_id, proveedor_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [nombre, descripcion, precio, stock, categoria_id, proveedor_id]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}