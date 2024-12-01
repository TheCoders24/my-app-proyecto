const { Pool } = require('pg');

// Verifica si la variable de entorno DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
    throw new Error('La variable de entorno DATABASE_URL no está definida');
}

// Crear un pool de conexiones
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
});

// Función para ejecutar consultas
const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res; // Devuelve el resultado de la consulta
    } catch (err) {
        console.error('Error ejecutando consulta:', err);
        throw err; // Lanza el error para ser manejado por el llamador
    } finally {
        client.release(); // Asegúrate de liberar el cliente después de usarlo
    }
};

// Función para cerrar el pool de conexiones
const closePool = async () => {
    await pool.end();
};

// Exportar las funciones
module.exports = {
    query,
};