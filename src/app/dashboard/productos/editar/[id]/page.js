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
    if (id) fetchProducto(); // Asegurar que `id` no sea undefined
  }, [id]);

  const fetchProducto = async () => {
    try {
      const response = await fetch(`/api/productos/nuevo?id=${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el producto');
      }
      const data = await response.json();
      if (!data) {
        throw new Error('Producto no encontrado');
      }
      setForm(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el producto');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/productos/${id}`, { // Debe incluir `id` en la URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form), // Se corrige el formato del body
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
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleChange}
          placeholder="ID de Categoría"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="proveedor_id"
          value={form.proveedor_id}
          onChange={handleChange}
          placeholder="ID del Proveedor"
          className="w-full p-2 border rounded"
        />

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
