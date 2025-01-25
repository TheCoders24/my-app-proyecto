"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioCategoria() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Resetear errores
    
    if (!nombre.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      const response = await fetch('/api/categorias/nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la categoría');
      }

      router.push('/dashboard');

    } catch (error) {
      console.error('Error al crear categoría:', error);
      setError(error.message || 'Ocurrió un error al guardar la categoría');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nueva Categoría</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la categoría*
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError(''); // Limpiar error al escribir
            }}
            placeholder="Ej. Electrónica"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            disabled={!nombre.trim()} // Deshabilitar si está vacío
          >
            Crear Categoría
          </button>
        </div>
      </form>
    </div>
  );
}