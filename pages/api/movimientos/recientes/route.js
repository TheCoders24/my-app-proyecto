import { query } from "../../../../lib/db";

export async function GET() {
  try {
    // Consulta SQL para obtener los movimientos recientes
    const result = await query(`
      SELECT 
        Movimientos.id,
        Productos.nombre AS producto,
        Movimientos.tipo,
        Movimientos.cantidad,
        Movimientos.fecha
      FROM Movimientos
      INNER JOIN Productos ON Movimientos.producto_id = Productos.id
      ORDER BY Movimientos.fecha DESC
      LIMIT 10
    `);

    // Devuelve la respuesta en formato JSON
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener movimientos recientes:', error);
    return new Response(JSON.stringify({ message: 'Error al obtener movimientos recientes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}