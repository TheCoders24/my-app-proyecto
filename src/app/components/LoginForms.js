"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // Importar para notificaciones

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Estado para mensaje de éxito
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() =>{
    setIsClient(true);
  });

  const handleLogin = async (e) => {
    //Prevenir el comportamiento predeterminado del formulario
    e.preventDefault();
    //Limpiar errores previos
    setError("");
    //Limpiar Mensaje de exitos previos
    setSuccess("");
    try {
      // Realizar la Solicitudes POST al backend para iniciar sesion
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Parsear la respuesta  JSON
      const data = await response.json();
      console.log("Respuesta del Servidor:", data);

      if (response.ok) {
        // Mensaje de éxito
        // si la respuesta es  correcta nomas va a suceder lo siguiente
        setSuccess("¡Autenticación exitosa! Redirigiendo...");
        //Mostrar notificacion de exito
        toast.success("Autenicacion exitos");
        //Limpiar los campos de entrada despues de un inicio de sesion exitosa
        setEmail('');
        setPassword('');
        // Almacenar el token en localStorage
        sessionStorage.setItem(process.env.JWT_SECRET, data.token);
        console.log("Token Almacenado en el LocalStorage", process.env.JWT_SECRET, data.token);
        // Redirección con delay
        setTimeout(() => router.push("/dashboard"), 10);
      } 
      else
      {
        // Mostrar error específico del servidor
        setError(data.message || "Error al iniciar sesión");
        toast.error(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      // Manejar errores de conexión
      setError("Error de conexión con el servidor");
      toast.error("Error de conexión");
    }

    //Limpiamos los campos de Email y Password
    setEmail("");
    setPassword("");

    // Verificamos que ambos campos estan Validos
    const userAuth = {
      email,
      password
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userAuth),
      })
    }catch(error){
      setError("Error al Auth con el Servidor");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Contenedor de notificaciones Toast */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}