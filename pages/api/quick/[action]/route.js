import { query } from "../../../../lib/db";

export async function POST(request, { params }) {
  const { action } = params;
  const { cantidad } = await request.json();

  try {
    let queryString;
    switch (action) {
      case 'ajuste':
        queryString = 'INSERT INTO Movimientos (producto_id, tipo, cantidad) VALUES (1, \'ajuste\', $1)';
        break;
      case 'entrada':
        queryString = 'INSERT INTO Movimientos (producto_id, tipo, cantidad) VALUES (1, \'entrada\', $1)';
        break;
      case 'salida':
        queryString = 'INSERT INTO Movimientos (producto_id, tipo, cantidad) VALUES (1, \'salida\', $1)';
        break;
      default:
        return new Response(JSON.stringify({ message: 'Acción no válida' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    await query(queryString, [cantidad]);
    return new Response(JSON.stringify({ message: 'Acción realizada con éxito' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error en acción rápida:', error);
    return new Response(JSON.stringify({ message: 'Error en acción rápida' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}