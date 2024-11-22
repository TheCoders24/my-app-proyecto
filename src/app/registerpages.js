"use client";

import { useState } from "react";

const RegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del nuevo usuario

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que el formulario se recargue
    setLoading(true);
    setErrorMessage("");

    const username = event.target.username.value.trim();
    const password = event.target.password.value.trim();

    console.log("Username:", username);
    console.log("Password:", password);

    if (!username || !password) {
      setErrorMessage("Por favor, ingrese ambos campos");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {  // Cambia a la ruta de tu API de registro
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log("Data:", data);

      if (!response.ok) {
        console.error("Error en la respuesta:", data);
        setErrorMessage(data.message || "Error al enviar la petición");
        return;
      }

      if (data.success) {
        console.log("Registro exitoso");
        setUserId(data.id); // Guardar el ID del nuevo usuario en el estado
        alert("Usuario registrado con éxito. ID: " + data.id);
        // Redirigir al usuario a la página de login, por ejemplo
        // window.location.href = "/login";
      } else {
        console.log("Fallo en el registro");
        setErrorMessage(data.message || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMessage("Ocurrió un error inesperado. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page flex justify-center items-center h-screen bg-gray-100">
      <form
        className="register-form bg-white p-8 rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <label
          htmlFor="username"
          className="block text-gray-700 font-medium mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Register"}
        </button>
      </form>
      {userId && <div>Registered with user ID: {userId}</div>} {/* Mostrar el ID si el registro es exitoso */}
    </div>
  );
};

export default RegisterPage;
