"use client";

export default function Clientes() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Gestión de Clientes</h1>
      <button className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300">
        Crear Cliente
      </button>
      <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí va la lógica para listar clientes */}
          <tr className="hover:bg-gray-100 transition duration-200">
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">Juan Pérez</td>
            <td className="border px-4 py-2">juan@example.com</td>
            <td className="border px-4 py-2">123456789</td>
            <td className="border px-4 py-2">
              <button className="text-blue-600 hover:underline">Editar</button>
              <button className="text-red-600 hover:underline ml-2">Eliminar</button>
            </td>
          </tr>
          {/* Puedes agregar más filas aquí */}
        </tbody>
      </table>
    </div>
  );
}