"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ListadoProductos() {
  const [productos, setProductos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/productos/nuevo'); // Ruta corregida
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los productos');
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/productos/editar/${id}`); // Redirige a la página de edición
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
      if (!confirmDelete) return;
  
      const response = await fetch(`/api/productos/nuevo?id=${id}`, { method: 'DELETE' });
  
      if (!response.ok) {
        const errorData = await response.json(); // Intentar obtener detalles del error
        throw new Error(errorData.message || 'Error al eliminar el producto');
      }
  
      toast.success('Producto eliminado con éxito');
  
      // Si usas React con estado, podrías actualizarlo directamente sin recargar la lista
      setProductos((prevProductos) => prevProductos.filter((producto) => producto.id !== id));
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al eliminar el producto');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Listado de Productos</h1>
      <button
        onClick={() => router.push('/dashboard')}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-4"
      >
        Volver al Dashboard
      </button>
      <div className="space-y-4">
        {productos.map((producto) => (
          <div key={producto.id} className="border p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: {producto.stock}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(producto.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(producto.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}