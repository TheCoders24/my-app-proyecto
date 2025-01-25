import { query } from "../../../lib/db";

export default async function handler(req, res) {
  // Manejar solicitudes POST
  if (req.method === 'POST') {
    // Extraer datos del cuerpo de la solicitud
    const { nombre, descripcion, precio, stock, categoria_id, proveedor_id } = req.body;

    // Validación de campos obligatorios
    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Los campos nombre, precio y stock son obligatorios' });
    }

    // Validación de tipos de datos numéricos
    if (
      isNaN(parseFloat(precio)) ||
      isNaN(parseInt(stock, 10)) ||
      (categoria_id && isNaN(parseInt(categoria_id, 10))) ||
      (proveedor_id && isNaN(parseInt(proveedor_id, 10)))
    ) {
      return res.status(400).json({ error: 'Precio, stock, categoría ID y proveedor ID deben ser números válidos' });
    }

    try {
      // Ejecutar la consulta SQL
      const result = await query(
        `INSERT INTO Productos 
         (nombre, descripcion, precio, stock, categoria_id, proveedor_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          nombre,
          descripcion || null, // Si no se proporciona descripción, se inserta NULL
          parseFloat(precio), // Convertir a número decimal
          parseInt(stock, 10), // Convertir a número entero
          categoria_id || null, // Si no se proporciona categoría_id, se inserta NULL
          proveedor_id || null, // Si no se proporciona proveedor_id, se inserta NULL
        ]
      );

      // Verificar si se insertó correctamente
      if (result.rows.length === 0) {
        return res.status(500).json({ error: 'No se pudo insertar el producto' });
      }

      // Responder con el producto insertado
      res.status(201).json(result.rows[0]);
    } catch (error) {
      // Manejo de errores
      console.error('Error en la inserción del producto:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Manejar solicitudes GET
  else if (req.method === 'GET') {
    try {
      const result = await query('SELECT id, nombre, stock FROM Productos');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Manejar otros métodos HTTP
  else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}