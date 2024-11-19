import { query } from '../../lib/db';

export default async function productos(req, res) {
    try {
        const result = await query('SELECT * FROM producto');
        console.log('Resultado de la consulta productos:', result.rows); // Improved logging
        res.status(200).json(result.rows); // Explicitly setting the status code
    } catch (error) {
        console.error('Error al obtener la consulta:', error); // Use console.error for errors
        res.status(500).json({ error: 'Error al conectar a PostgreSQL' });
    }
}