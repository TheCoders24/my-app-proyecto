"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioVenta() {
  const router = useRouter();
  const [venta, setVenta] = useState({
    usuario_id: '',
    productos: [{ id: '', cantidad: 1, precio: 0 }]
  });

  const addProducto = () => {
    setVenta({
      ...venta,
      productos: [...venta.productos, { id: '', cantidad: 1, precio: 0 }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const total = venta.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
      
      const response = await fetch('/api/ventas/nueva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...venta,
          total: total
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {venta.productos.map((producto, index) => (
        <div key={index} className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Producto ID</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={producto.id}
              onChange={(e) => {
                const nuevosProductos = [...venta.productos];
                nuevosProductos[index].id = e.target.value;
                setVenta({...venta, productos: nuevosProductos});
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={producto.cantidad}
              onChange={(e) => {
                const nuevosProductos = [...venta.productos];
                nuevosProductos[index].cantidad = parseInt(e.target.value);
                setVenta({...venta, productos: nuevosProductos});
              }}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addProducto}
        className="bg-gray-200 px-4 py-2 rounded-md text-sm"
      >
        + Agregar Producto
      </button>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 block w-full"
      >
        Registrar Venta
      </button>
    </form>
  );
}