import { query } from './../../lib/db';
import bcrypt from 'bcrypt';

export default async function handleRegister (request) {
    const { username, password } = await request.json();

    try {
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
        }

        return NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
};
