"use client";

import { useState, useEffect } from "react";

export default function ModalReportes({ isOpen, onClose }) {
  const [reporte, setReporte] = useState([]);

  // Función para obtener el reporte
  const fetchReporte = async () => {
    try {
      const response = await fetch("/api/report");
      const data = await response.json();
      setReporte(data);
    } catch (error) {
      console.error("Error obteniendo reporte:", error);
    }
  };

  // Cargar el reporte cuando el modal se abra
  useEffect(() => {
    if (isOpen) {
      fetchReporte();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Reporte de Movimientos</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Producto</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Cantidad</th>
              <th className="py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reporte.length > 0 ? (
              reporte.map((mov, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3">{mov.producto}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        mov.tipo === "entrada"
                          ? "bg-green-100 text-green-800"
                          : mov.tipo === "salida"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {mov.tipo}
                    </span>
                  </td>
                  <td className="py-3">{mov.cantidad}</td>
                  <td className="py-3 text-gray-500">
                    {new Date(mov.fecha).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 text-center text-gray-500">
                  No hay movimientos recientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}