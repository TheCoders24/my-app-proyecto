import { query } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre } = req.body;

  try {
    const result = await query(
      'INSERT INTO Categorias (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando categoría:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}