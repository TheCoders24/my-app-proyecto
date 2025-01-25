import { query } from "../../../lib/db";

const registrarMovimiento = async (req, res) => {
  const { producto_id, tipo, cantidad, usuario_id } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!producto_id || !tipo || !cantidad) {
    return res.status(400).json({
      message: 'Faltan campos requeridos: producto_id, tipo, cantidad',
    });
  }

  try {
    // Consulta SQL para insertar un movimiento
    const sqlQuery = `
      INSERT INTO Movimientos (producto_id, tipo, cantidad, usuario_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    // Ejecutar la consulta
    const result = await query(sqlQuery, [producto_id, tipo, cantidad, usuario_id]);

    // Responder con el movimiento registrado
    res.status(201).json({
      message: 'Movimiento registrado exitosamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    res.status(500).json({
      message: 'Error al registrar movimiento',
      error: error.message,
    });
  }
};

export default registrarMovimiento;