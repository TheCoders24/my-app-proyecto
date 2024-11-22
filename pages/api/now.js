import { query } from './../../lib/db';

export default async function handler(req, res) {
    // Verifica si el método de la solicitud es GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }
    try 
    {
        // Ejecuta la consulta para obtener la hora del servidor
        const result = await query('SELECT NOW()');
        console.log('Resultado de la consulta:', result.rows[0]);
        // Devuelve la hora del servidor en el formato esperado
        res.status(200).json({ serverTime: result.rows[0].now }); // Asegúrate de acceder a la propiedad correcta
    } 
    catch (error) 
    {
        console.error('Error al obtener hora del servidor:', error);
        res.status(500).json({ error: 'Error al conectarse a PostgreSQL' });
    }
}