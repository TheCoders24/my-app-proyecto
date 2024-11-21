import bcrypt from 'bcrypt'; // Asegúrate de que bcrypt esté instalado
import { query } from '../../lib/db'; // Importa tu función para consultas a la base de datos

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, password } = req.body;

            // Consulta para obtener los datos del usuario
            const result = await query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            // Verifica la contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            // Login exitoso
            return res.status(200).json({ success: true, message: 'Login successful' });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
