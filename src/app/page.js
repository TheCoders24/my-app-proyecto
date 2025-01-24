import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a Mi Proyecto</h1>
        <p className="text-gray-700 mb-6">
          Por favor, inicia sesión o regístrate para continuar.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/Register"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}