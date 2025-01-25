import { query } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, contacto, telefono, email } = req.body;

  try {
    const result = await query(
      `INSERT INTO Proveedores (nombre, contacto, telefono, email)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, contacto || null, telefono || null, email || null]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registrando proveedor:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}