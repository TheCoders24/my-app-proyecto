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
        body: JSON.stringify({
          ...form,
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock, 10),
          categoria_id: parseInt(form.categoria_id, 10),
          proveedor_id: parseInt(form.proveedor_id, 10)
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
   router.push( "/dashboard");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre*</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.nombre}
          onChange={(e) => setForm({...form, nombre: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.descripcion}
          onChange={(e) => setForm({...form, descripcion: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Precio*</label>
        <input
          type="number"
          required
          step="0.01"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.precio}
          onChange={(e) => setForm({...form, precio: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock*</label>
        <input
          type="number"
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.stock}
          onChange={(e) => setForm({...form, stock: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Categoría ID*</label>
        <input
          type="number"
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.categoria_id}
          onChange={(e) => setForm({...form, categoria_id: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Proveedor ID*</label>
        <input
          type="number"
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.proveedor_id}
          onChange={(e) => setForm({...form, proveedor_id: e.target.value})}
        />
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={handleClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex-1"
        >
          Volver al Dashboard
        </button>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1"
        >
          Registrar Producto
        </button>
      </div>
    </form>
  );
}