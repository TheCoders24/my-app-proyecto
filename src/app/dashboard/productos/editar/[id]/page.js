"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function EditarProducto() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria_id: '',
    proveedor_id: ''
  });

  useEffect(() => {
    fetchProducto();
  }, [id]);

  const fetchProducto = async () => {
    try {
      const response = await fetch(`/api/productos/${id}`); // Obtener producto específico
      if (!response.ok) {
        throw new Error('Error al obtener el producto');
      }
      const data = await response.json();
      if (!data) {
        throw new Error('Producto no encontrado');
      }
      setForm(data); // Actualizar el estado con los datos del producto
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el producto');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/productos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(id, ...form),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }
      toast.success('Producto actualizado con éxito');
      router.push('/dashboard/productos');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos del formulario (igual que en FormularioProducto) */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/productos')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex-1 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}