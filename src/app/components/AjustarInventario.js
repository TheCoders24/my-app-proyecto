"use client";

import { useState } from "react";

export default function AjustarInventario({ onClose }) {
  const [productoId, setProductoId] = useState(1); // ID del producto
  const [cantidad, setCantidad] = useState(0); // Cantidad a ajustar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAjustarInventario = async () => {
    if (!productoId || cantidad === 0) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quick/ajuste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ producto_id: productoId, cantidad }),
      });

      if (response.ok) {
        alert("Inventario ajustado correctamente");
        onClose(); // Cerrar el modal después de ajustar el inventario
      } else {
        const data = await response.json();
        setError(data.message || "Error ajustando inventario");
      }
    } catch (error) {
      console.error("Error ajustando inventario:", error);
      setError("Error ajustando inventario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Ajustar Inventario</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ID del Producto
          </label>
          <input
            type="number"
            value={productoId}
            onChange={(e) => setProductoId(parseInt(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleAjustarInventario}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Ajustando..." : "Ajustar"}
          </button>
        </div>
      </div>
    </div>
  );
}