import { query } from "../../../lib/db";
import bcrypt from "bcrypt";
import validator from "validator"; // Librería para validar datos

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

  try {
    // Buscar el usuario en la base de datos
    const user = await query(
      "SELECT id, password, rol FROM Usuarios WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Autenticación exitosa
    res.status(200).json({ message: "Autenticación exitosa", rol: user.rows[0].rol });
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({ message: "Error en el servidor" }); // No devuelvas detalles del error
  }
}