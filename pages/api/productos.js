import { query } from '../../lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const result = await query('SELECT * FROM producto ORDER BY producto_id DESC');
                res.status(200).json(result.rows);
                console.log("se ejecuto correctamente la consulta");
            } catch (error) {
                console.error('Error al obtener productos:', error);
                res.status(500).json({ error: 'Error al recuperar productos' });
            }
            break;

        case 'POST':
            try {
                const { nombre, descripcion, precio, cantidad_en_inventario } = req.body;

                // Validaciones
                if (!nombre) {
                    return res.status(400).json({ error: 'El nombre es obligatorio' });
                }

                const result = await query(
                    `INSERT INTO producto 
          (nombre, descripcion, precio, cantidad_en_inventario) 
          VALUES ($1, $2, $3, $4) RETURNING *`,
                    [nombre, descripcion || null, precio, cantidad_en_inventario]
                );

                res.status(201).json(result.rows[0]);
                console.log("se creo correctamente el producto");
            } catch (error) {
                console.error('Error al crear producto:', error);
                res.status(500).json({ error: 'Error al crear producto' });
            }
            break;

        case 'PUT':
            try {
                const { producto_id, nombre, descripcion, precio, cantidad_en_inventario } = req.body;

                // Validaciones
                if (!producto_id) {
                    return res.status(400).json({ error: 'El ID del producto es obligatorio' });
                }

                const result = await query(
                    `UPDATE producto 
          SET nombre = $1, 
              descripcion = $2, 
              precio = $3, 
              cantidad_en_inventario = $4 
          WHERE producto_id = $5 RETURNING *`,
                    [nombre, descripcion || null, precio, cantidad_en_inventario, producto_id]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }

                res.status(200).json(result.rows[0]);
                console.log("se actualizo correctamente el producto");
            } catch (error) {
                console.error('Error al actualizar producto:', error);
                res.status(500).json({ error: 'Error al actualizar producto' });
            }
            break;

        case 'DELETE':
            try {
                const { producto_id } = req.body;

                // Validaciones
                if (!producto_id) {
                    return res.status(400).json({ error: 'El ID del producto es obligatorio' });
                }

                const result = await query(
                    'DELETE FROM producto WHERE producto_id = $1 RETURNING *',
                    [producto_id]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }

                res.status(200).json({
                    message: 'Producto eliminado exitosamente',
                    producto: result.rows[0]
                });
                console.log("se elimino correctamente el producto");
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                res.status(500).json({ error: 'Error al eliminar producto' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}