// pages/api/login.js
import { NextResponse } from "next/server";
import { query } from './../../lib/db'; // Asegúrate de que la ruta sea correcta
import bcrypt from 'bcrypt';

export async function POST(request) {
    const { username, password } = await request.json();

    try {
        // Aquí utilizamos la función query para realizar la consulta
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            return NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}