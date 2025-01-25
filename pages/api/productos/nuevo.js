import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, descripcion, precio, stock, categoria_id, proveedor_id } = req.body;

    // Input validation
    if (!nombre || !descripcion || precio === undefined || stock === undefined || !categoria_id || !proveedor_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (isNaN(precio) || isNaN(stock) || isNaN(categoria_id) || isNaN(proveedor_id)) {
      return res.status(400).json({ error: 'Precio, stock, categoría ID y proveedor ID deben ser números válidos' });
    }

    try {
      const result = await pool.query(
        `INSERT INTO productos 
        (nombre, descripcion, precio, stock, categoria_id, proveedor_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [nombre, descripcion, parseFloat(precio), parseInt(stock, 10), parseInt(categoria_id, 10), parseInt(proveedor_id, 10)]
      );

      if (result.rows.length === 0) {
        return res.status(500).json({ error: 'No se pudo insertar el producto' });
      }

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error en la inserción del producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}