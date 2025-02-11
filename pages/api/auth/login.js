import { query } from "../../../lib/db";
import bcrypt from "bcrypt";
import validator from "validator"; // Para validar datos
import jwt from "jsonwebtoken"; // Para generar tokens JWT

// Objeto para almacenar intentos fallidos por IP
let failedAttempts = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email, password } = req.body;

  // Validación de entrada
  if (!email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "El email no es válido" });
  }

  // Validación de fortaleza de la contraseña (opcional)
  if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    return res.status(400).json({ message: "La contraseña no cumple con los requisitos de seguridad" });
  }

  // Obtener la IP del cliente
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Verificar si la IP está bloqueada por demasiados intentos fallidos
  if (failedAttempts[ip] && failedAttempts[ip].count >= 5) {
    const blockTime = 15 * 60 * 1000; // 15 minutos
    if (Date.now() - failedAttempts[ip].lastAttempt < blockTime) {
      return res.status(429).json({ message: "Demasiados intentos. Intenta de nuevo más tarde." });
    } else {
      // Reiniciar el contador después del tiempo de bloqueo
      delete failedAttempts[ip];
    }
  }

  try {
    // Buscar el usuario en la base de datos
    const user = await query(
      "SELECT id, password, rol FROM Usuarios WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      // Incrementar el contador de intentos fallidos
      failedAttempts[ip] = {
        count: (failedAttempts[ip]?.count || 0) + 1,
        lastAttempt: Date.now(),
      };
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      // Incrementar el contador de intentos fallidos
      failedAttempts[ip] = {
        count: (failedAttempts[ip]?.count || 0) + 1,
        lastAttempt: Date.now(),
      };
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.rows[0].id, email: email, rol: user.rows[0].rol }, // Payload
      process.env.JWT_SECRET, // Clave secreta desde .env
      { expiresIn: "1h" } // Expira en 1 hora
    );

    // Enviar el token como una cookie segura
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60}` // Expira en 1 hora
    );

    // Reiniciar el contador de intentos fallidos después de un inicio de sesión exitoso
    delete failedAttempts[ip];

    // Respuesta exitosa
    res.status(200).json({ message: "Autenticación exitosa", rol: user.rows[0].rol });
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({ message: "Error en el servidor" }); // No devuelvas detalles del error
  }
}