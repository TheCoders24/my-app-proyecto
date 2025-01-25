"use client";
import { useState } from 'react';

export default function FormularioCategoria({ onClose = () => {} }) { // Valor predeterminado añadido
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!nombre.trim()) {
        throw new Error('El nombre de la categoría es obligatorio');
      }

      const response = await fetch('/api/categorias/nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombre.trim() }),
      });
      console.log(nombre.toString());
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la categoría');
      }
      setError('Categoria registrada con exito')
      onClose(true); // Cerrar modal y actualizar lista
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error al crear categoría:', error);
      setError(error.message || 'Ocurrió un error al guardar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Nueva Categoría</h2>
        <button
          onClick={() => onClose()} // onClose es ahora una función garantizada
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la categoría *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError('');
            }}
            placeholder="Ej. Electrónica"
            maxLength={100}
            autoFocus
          />
          <p className="mt-1 text-xs text-gray-500">Máximo 100 caracteres</p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => onClose()} // onClose es ahora una función garantizada
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            disabled={isSubmitting || !nombre.trim()}
          >
            {isSubmitting ? 'Creando...' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}