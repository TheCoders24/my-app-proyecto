import bcrypt from 'bcrypt'; // Asegúrate de que bcrypt esté instalado
import { query } from './../../lib/db'; // Importa tu función para consultas a la base de datos

export const config = {
    api: {
        bodyParser: true, // Asegúrate de que el bodyParser está habilitado
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Verifica que el cuerpo de la solicitud contenga los datos esperados
            console.log('Request body:', req.body);
            const { username, password } = req.body;

            if (!username || !password) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Username and password are required' });
            }

            // Consulta para obtener los datos del usuario
            const result = await query('SELECT * FROM users WHERE username = $1', [username]);
            console.log('Database query result:', result.rows);

            if (!result.rows || result.rows.length === 0) {
                return res
                    .status(401)
                    .json({ success: false, message: 'Invalid username or password' });
            }

            const user = result.rows[0];
            console.log('User fetched from database:', user);

            // Verifica la contraseña
            console.log('Stored password hash:', user.password);
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('Password match result:', isValidPassword);

           
            // Login exitoso
            console.log('Login successful for user:', username);
            return res.status(200).json({ success: true, message: 'Login successful' });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        // Responde con un mensaje de método no permitido si no es POST
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
