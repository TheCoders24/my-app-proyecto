import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    
    try {
      await query('BEGIN'); // Iniciar transacción

      const { usuario_id, total, productos } = req.body;

      // Validar datos de entrada
      if (!usuario_id || !total || !productos || !Array.isArray(productos)) {
        console.log(usuario_id);
        console.log(total);
        console.log(productos);
        console.log("Datos de entrada invalidos");
        return res.status(400).json({ error: 'Datos de entrada inválidos' });
      }

      // Verificar el stock de cada producto
      for (const producto of productos) {
        if (!producto.id || !producto.cantidad || !producto.precio) {
          throw new Error('Datos de producto inválidos');
        }

        const stockResult = await query(
          `SELECT stock FROM productos WHERE id = $1`,
          [producto.id]
        );

        if (stockResult.rows.length === 0) {
          throw new Error(`Producto ${producto.id} no encontrado`);
        }

        if (stockResult.rows[0].stock < producto.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.id}`);
        }
      }

      // Registrar la venta
      const venta = await query(
        `INSERT INTO ventas (usuario_id, total) 
        VALUES ($1, $2) 
        RETURNING id`,
        [usuario_id, total]
      );

      // Registrar los detalles de la venta
      for (const producto of productos) {
        await query(
          `INSERT INTO detalle_ventas 
          (venta_id, producto_id, cantidad, precio) 
          VALUES ($1, $2, $3, $4)`,
          [venta.rows[0].id, producto.id, producto.cantidad, producto.precio]
        );

        // Actualizar el stock del producto
        await query(
          `UPDATE productos 
          SET stock = stock - $1 
          WHERE id = $2`,
          [producto.cantidad, producto.id]
        );
      }

      await query('COMMIT'); // Confirmar transacción
      res.status(201).json({ id: venta.rows[0].id }); // Devolver el ID de la venta
    } catch (error) {
      await query('ROLLBACK'); // Revertir transacción en caso de error
      console.error('Error al registrar la venta:', error);
      res.status(500).json({ error: error.message });
    } finally {
      
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' }); // Método no soportado
  }
}