import { query } from "../../../../lib/db";

export default async function  GET(req, res) {
  try {
    // Consulta SQL para obtener los movimientos recientes
    const result = await query(`
      SELECT 
        Movimientos.id,
        Productos.nombre AS producto,
        Movimientos.tipo,
        Movimientos.cantidad,
        Movimientos.fecha,
        Usuarios.nombre AS usuario
      FROM Movimientos
      INNER JOIN Productos ON Movimientos.producto_id = Productos.id
      LEFT JOIN Usuarios ON Movimientos.usuario_id = Usuarios.id
      ORDER BY Movimientos.fecha DESC
      LIMIT 10
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener movimientos recientes:', error);
    return new Response(JSON.stringify({ message: 'Error al obtener movimientos recientes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}