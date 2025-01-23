"use client";

export default function Ventas() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Gestión de Ventas</h1>
      <button className="mb-4 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
        Crear Venta
      </button>
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Usuario</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí va la lógica para listar ventas */}
        </tbody>
      </table>
    </div>
  );
}
