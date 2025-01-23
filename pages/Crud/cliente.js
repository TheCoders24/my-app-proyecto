"use client";

export default function Clientes() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Gestión de Clientes</h1>
      <button className="mb-4 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
        Crear Cliente
      </button>
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí va la lógica para listar clientes */}
        </tbody>
      </table>
    </div>
  );
}
