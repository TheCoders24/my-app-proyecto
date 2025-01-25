import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT id, nombre, stock FROM Productos');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}