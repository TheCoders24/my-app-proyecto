import { query } from "../../../lib/db";
import bcrypt from "bcrypt"; // Para comparar contraseñas hasheadas

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email, password } = req.body;

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
    res.status(500).json({ message: "Error en el servidor" });
  }
}