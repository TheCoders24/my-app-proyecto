import { query } from "../../../lib/db";
import bcrypt from "bcrypt";
import validator from "validator"; // Librería para validar datos

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { nombre, email, password, rol } = req.body;

  if(!nombre || !email || !password || !rol){
    return res.status(400).json({message: "Todos los Campos Son Obligatorios"});
  }

  if(!validator.isEmail(email)){
    return res.status(400).json({message: "El email no es Valido"});
  }

  if(!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })){
    return res.status(400).json({ message: "las contraseñas no cumple con requisitos de seguridad"});
  }

  try {
    // Verificar si el email ya está registrado
    const existingUser = await query(
      "SELECT id FROM Usuarios WHERE email = $1",
      [email]
    );

    // Verificamos que el email si ya esta registrado en la base de datos
    if(existingUser.rows.length > 0){
      return res.status(400).json({ message: "El email ya esta Registrado"});
    }

    // Hashear la contraseña con un salt adecuado
    const hashedPassword = await bcrypt.hash(password, 10); // Usar 10 SaltRounds

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
      error: "Ocurrio un error al procesar la solicitud", // Devuelve el mensaje de error específico
    });
  }
}