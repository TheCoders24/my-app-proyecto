import bcrypt from 'bcrypt'; // Asegúrate de que bcrypt esté instalado
import { query } from './../../lib/db'; // Importa tu función para consultas a la base de datos

export const config = {
    api: {
        bodyParser: true, // Asegúrate de que el bodyParser esté habilitado
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('Request body:', req.body);
            // Verifica que el cuerpo de la solicitud contenga los datos esperados
            const { username, password } = req.body;
            console.log('Username:', username);
            console.log('Password:', password);

            if(username.length < 3){
                return res
                    .status(400)
                    .json({ success: false, message: 'Username must be at least 3 characters long' });
            }
            if(password.length < 6){
                return res
                    .status(400)
                    .json({ success: false, message: 'Password must be at least 6 characters long' });
            }

            if (!username || !password) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Username and password are required' });
            }

            // Verifica si el nombre de usuario ya está en uso
            const userCheckResult = await query('SELECT * FROM users WHERE username = $1', [username]);
            console.log('User check result:', userCheckResult.rows);

            if (userCheckResult.rows.length > 0) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Username is already taken' });
            }

            // Cifra la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Hashed password:', hashedPassword);

            // Inserta el nuevo usuario en la base de datos
            await query(
                'INSERT INTO users (username, password) VALUES ($1, $2)',
                [username, hashedPassword]
            );
            console.log('User inserted into database');

            // Devuelve un mensaje de éxito
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
            });
        } catch (error) {
            console.error('Error during user registration:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        // Responde con un mensaje de método no permitido si no es POST
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
