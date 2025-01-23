"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const sections = [
    { name: "Usuarios", path: "/Crud/users" },
    { name: "Productos", path: "/Crud/producto" },
    { name: "Clientes", path: "/Crud/cliente" },
    { name: "Ventas", path: "/Crud/venta" },
    { name: "Detalle de Ventas", path: "/Crud/detalle_venta" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-10">Dashboard</h1>
        
        {/* Container for the buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          {sections.map((section) => (
            <div key={section.path} className="flex justify-center">
              <div className="w-full max-w-xs">
                <button
                  onClick={() => router.push(section.path)}
                  className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {section.name}
                </button>
                <div className="mt-2 text-center">
                  <p className="text-blue-600">Accede a {section.name.toLowerCase()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}