// pages/api/stats/products.js
import { query } from '../../../lib/db';


export default async function handler(req, res) {
  try {
    // Obtener los nombres y el stock de cada producto
    const { rows } = await query('SELECT nombre, stock FROM productos');
    
    // Calcular el total de stock
    const total = rows.reduce((sum, product) => sum + product.stock, 0);

    // Devolver los nombres, el stock y el total
    res.status(200).json({ 
      total, 
      data: rows // Devuelve los nombres y el stock de cada producto
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}