import { query } from "../../../lib/db";
import bcrypt from "bcrypt";
import validator from "validator"; // Para validar datos
import jwt from "jsonwebtoken"; // Para generar tokens JWT (opcional)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { nombre, email, password, rol } = req.body;

  // Validación de entrada
  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "El email no es válido" });
  }

  if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    return res.status(400).json({ message: "La contraseña no cumple con los requisitos de seguridad" });
  }

  try {
    // Verificar si el email ya está registrado
    const existingUser = await query(
      "SELECT id FROM Usuarios WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo del hashing

    // Insertar el nuevo usuario en la base de datos
    const result = await query(
      "INSERT INTO Usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id",
      [nombre, email, hashedPassword, rol]
    );

    if (result.rows.length > 0) {
      // Generar token JWT (opcional, para autenticar al usuario inmediatamente después del registro)
      const token = jwt.sign(
        { userId: result.rows[0].id, email: email, rol: rol }, // Payload
        process.env.JWT_SECRET, // Clave secreta desde .env
        { expiresIn: "1h" } // Expira en 1 hora
      );

      // Enviar el token como una cookie segura (opcional)
      res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60}` // Expira en 1 hora
      );

      // Respuesta exitosa
      res.status(201).json({ message: "Usuario registrado exitosamente" });
    } else {
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor" }); // No devuelvas detalles del error
  }
}