import { query } from "../../../lib/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { nombre, email, password, rol } = req.body;

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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const result = await query(
      "INSERT INTO Usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id",
      [nombre, email, hashedPassword, rol]
    );

    if (result.rows.length > 0) {
      res.status(201).json({ message: "Usuario registrado exitosamente" });
    } else {
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message, // Devuelve el mensaje de error específico
    });
  }
}