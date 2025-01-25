"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioMovimiento() {
  const router = useRouter();
  const [form, setForm] = useState({
    producto_id: '',
    tipo: 'entrada',
    cantidad: 0,
    usuario_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/movimientos/registrar', {
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
        <label className="block text-sm font-medium text-gray-700">Producto</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.producto_id}
          onChange={(e) => setForm({...form, producto_id: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.tipo}
          onChange={(e) => setForm({...form, tipo: e.target.value})}
        >
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Registrar Movimiento
      </button>
    </form>
  );
}