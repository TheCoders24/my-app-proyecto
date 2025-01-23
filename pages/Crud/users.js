"use client";

export default function Usuarios() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Gestión de Usuarios</h1>
      <button className="mb-4 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
        Crear Usuario
      </button>
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Usuario</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí va la lógica para listar usuarios */}
          <tr>
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">John Doe</td>
            <td className="border px-4 py-2">
              <button className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Editar
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
