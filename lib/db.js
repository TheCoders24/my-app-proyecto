const { Pool } = require('pg');

// Crear un pool de conexiones
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Función para ejecutar consultas
const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } catch (err) {
        console.error('Error ejecutando consulta:', err);
        throw err;
    } finally {
        client.release();
    }
};

module.exports = {
    query,
};
