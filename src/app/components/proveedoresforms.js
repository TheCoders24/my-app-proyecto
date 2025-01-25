"use client";
import { useState } from 'react';

export default function FormularioProveedor({ onClose = () => {} }) { // Valor predeterminado añadido
  const [form, setForm] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!form.nombre.trim()) {
        throw new Error('El nombre del proveedor es obligatorio');
      }
      
      if (form.email && !validateEmail(form.email)) {
        throw new Error('El formato del email es inválido');
      }

      const response = await fetch('/api/proveedores/nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          contacto: form.contacto.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el proveedor');
      }

      onClose(true); // Cierra el modal y actualiza datos

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Proveedor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del proveedor*
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.nombre}
            onChange={(e) => setForm({...form, nombre: e.target.value})}
            placeholder="Ej. Distribuidora XYZ"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Persona de contacto
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.contacto}
            onChange={(e) => setForm({...form, contacto: e.target.value})}
            placeholder="Ej. Juan Pérez"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.telefono}
            onChange={(e) => setForm({...form, telefono: e.target.value})}
            placeholder="Ej. +52 55 1234 5678"
            pattern="[+]?[0-9\s\-]+"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            placeholder="contacto@proveedor.com"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose} // onClose ahora es una función garantizada
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            disabled={isSubmitting || !form.nombre.trim()}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Proveedor'}
          </button>
        </div>
      </form>
    </div>
  );
}