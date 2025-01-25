"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioProducto() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria_id: '',
    proveedor_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/productos/nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.nombre}
          onChange={(e) => setForm({...form, nombre: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          required
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.precio}
          onChange={(e) => setForm({...form, precio: parseFloat(e.target.value)})}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Registrar Producto
      </button>
    </form>
  );
}