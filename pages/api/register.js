import { query } from './../../lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server'; // Asegúrate de importar esto si usas Next.js

export default async function handleRegister (request) {
    const { username, password } = await request.body();

    try {
        // Verificar si el usuario ya existe
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user) {
            return NextResponse.json({ success: false, message: 'Username already exists' }, { status: 409 });
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar el nuevo usuario en la base de datos
        await query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

        return NextResponse.json({ success: true, message: 'User  registered successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
};