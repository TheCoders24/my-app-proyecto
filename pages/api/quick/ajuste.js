import { query } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { producto_id, cantidad } = req.body;

  try {
    // Insertar el movimiento de ajuste en la base de datos
    const ajusteQuery = `
      INSERT INTO Movimientos (producto_id, tipo, cantidad)
      VALUES ($1, 'ajuste', $2)
    `;
    await query(ajusteQuery, [producto_id, cantidad]);

    // Actualizar el stock del producto en la base de datos
    const updateStockQuery = `
      UPDATE Productos
      SET stock = stock + $1
      WHERE id = $2
    `;
    await query(updateStockQuery, [cantidad, producto_id]);

    res.status(200).json({ message: 'Inventario ajustado correctamente' });
  } catch (error) {
    console.error('Error ajustando inventario:', error);
    res.status(500).json({ message: 'Error ajustando inventario' });
  }
}