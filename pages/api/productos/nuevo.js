import { query } from "../../../lib/db";

export default async function handler(req, res) {
  // Manejar solicitudes POST (Crear producto)
  if (req.method === 'POST') {
    const { nombre, descripcion, precio, stock, categoria_id, proveedor_id } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Los campos nombre, precio y stock son obligatorios' });
    }

    if (
      isNaN(parseFloat(precio)) ||
      isNaN(parseInt(stock, 10)) ||
      (categoria_id && isNaN(parseInt(categoria_id, 10))) ||
      (proveedor_id && isNaN(parseInt(proveedor_id, 10)))
    ) {
      return res.status(400).json({ error: 'Precio, stock, categoría ID y proveedor ID deben ser números válidos' });
    }

    try {
      const result = await query(
        `INSERT INTO Productos 
         (nombre, descripcion, precio, stock, categoria_id, proveedor_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          nombre,
          descripcion || null,
          parseFloat(precio),
          parseInt(stock, 10),
          categoria_id || null,
          proveedor_id || null,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(500).json({ error: 'No se pudo insertar el producto' });
      }

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error en la inserción del producto:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Manejar solicitudes GET (Obtener productos o un solo producto)
  else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      if (id) {
        // Obtener un solo producto por ID
        const result = await query('SELECT * FROM Productos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.status(200).json(result.rows[0]);
      } else {
        // Obtener todos los productos
        const result = await query('SELECT id, nombre, stock, precio FROM Productos');
        return res.status(200).json(result.rows);
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Manejar solicitudes PUT (Actualizar producto)
  else if (req.method === 'PUT') {
    const { id } = req.query;
    const { nombre, descripcion, precio, stock, categoria_id, proveedor_id } = req.body;

    if (!id || isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'ID de producto no válido' });
    }

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Los campos nombre, precio y stock son obligatorios' });
    }

    try {
      const result = await query(
        `UPDATE Productos 
         SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria_id = $5, proveedor_id = $6 
         WHERE id = $7 
         RETURNING *`,
        [
          nombre,
          descripcion || null,
          parseFloat(precio),
          parseInt(stock, 10),
          categoria_id || null,
          proveedor_id || null,
          parseInt(id, 10),
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Manejar solicitudes DELETE (Eliminar producto)
  else if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'ID de producto no válido' });
    }

    try {
      const result = await query('DELETE FROM Productos WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.status(200).json({ success: true, deletedProduct: result.rows[0] });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Manejar otros métodos HTTP
  else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
