"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioMovimiento() {
  const router = useRouter();
  const [form, setForm] = useState({
    producto_id: '',
    tipo: 'entrada',
    cantidad: 0,
    usuario_id: ''
  });
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios

  // Obtener la lista de productos y usuarios al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const responseProductos = await fetch('/api/productos/nuevo');
        if (responseProductos.ok) {
          const dataProductos = await responseProductos.json();
          setProductos(dataProductos);
        } else {
          console.error('Error al obtener los productos');
        }

        // Obtener usuarios
        const responseUsuarios = await fetch('/api/usuarios/usuarios');
        if (responseUsuarios.ok) {
          const dataUsuarios = await responseUsuarios.json();
          setUsuarios(dataUsuarios);
        } else {
          console.error('Error al obtener los usuarios');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []); // Ejecutar solo una vez al cargar el componente

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
      } else {
        console.error('Error al registrar el movimiento');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {/* Combobox para seleccionar el producto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Producto</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.producto_id}
          onChange={(e) => setForm({ ...form, producto_id: e.target.value })}
        >
          <option value="">Seleccione un producto</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre} (Stock: {producto.stock})
            </option>
          ))}
        </select>
      </div>

      {/* Campo para el tipo de movimiento */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
      </div>

      {/* Campo para la cantidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
        <input
          type="number"
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.cantidad}
          onChange={(e) => setForm({ ...form, cantidad: parseInt(e.target.value, 10) })}
        />
      </div>

      {/* Combobox para seleccionar el usuario */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={form.usuario_id}
          onChange={(e) => setForm({ ...form, usuario_id: e.target.value })}
        >
          <option value="">Seleccione un usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre} ({usuario.email})
            </option>
          ))}
        </select>
      </div>

      {/* Botón para enviar el formulario */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Registrar Movimiento
      </button>
    </form>
  );
}