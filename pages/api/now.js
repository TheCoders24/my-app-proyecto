import { query } from './../../lib/db';

export default async function handler(req, res) {
    try {
        const result = await query('SELECT NOW()');
        res.status(200).json({ serverTime: result.rows[0] });
    } catch (error) {
        console.error('Error al obtener hora del servidor:', error);
        res.status(500).json({ error: 'Error al conectarse a PostgreSQL' });
    }
}
