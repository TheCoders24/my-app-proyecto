"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioVenta() {
  const router = useRouter();
  const [venta, setVenta] = useState({
    usuario_id: '',
    productos: [{ id: '', cantidad: 1, precio: 0 }], // Inicializar con cantidad 1 y precio 0
  });
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);

  // Obtener los productos y usuarios disponibles al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const productosResponse = await fetch('/api/productos/nuevo');
        const productosData = await productosResponse.json();
        setProductosDisponibles(productosData);

        // Obtener usuarios
        const usuariosResponse = await fetch('/api/usuarios/usuarios');
        const usuariosData = await usuariosResponse.json();
        setUsuariosDisponibles(usuariosData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);

  // Agregar un nuevo producto al formulario
  const addProducto = () => {
    setVenta({
      ...venta,
      productos: [...venta.productos, { id: '', cantidad: 1, precio: 0 }],
    });
  };
  // Manejar cambios en los campos del formulario
  const handleChange = (index, field, value) => {
    const nuevosProductos = [...venta.productos];

    // Convertir a número si el campo es "cantidad" o "precio"
    const parsedValue = field === 'cantidad' || field === 'precio' ? parseFloat(value) : value;

    // Validar que parsedValue sea un número válido
    if (!isNaN(parsedValue)) {
      nuevosProductos[index][field] = parsedValue;

      // Si el campo es "id", actualizar el precio automáticamente
      if (field === 'id') {
        const productoSeleccionado = productosDisponibles.find(
          (p) => p.id === parsedValue
        );
        nuevosProductos[index].precio = productoSeleccionado
          ? productoSeleccionado.precio
          : 0;
      }

      setVenta({ ...venta, productos: nuevosProductos });
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcular el total de la venta
      const total = venta.productos.reduce(
        (sum, p) => sum + p.precio * p.cantidad,
        0
      );

      // Enviar la solicitud al endpoint de la API
      const response = await fetch('/api/ventas/nueva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...venta,
          total: total,
        }),
      });

      // Redirigir al dashboard si la respuesta es exitosa
      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {/* Combobox para seleccionar el usuario */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={venta.usuario_id}
          onChange={(e) => setVenta({ ...venta, usuario_id: e.target.value })}
        >
          <option value="">Seleccione un usuario</option>
          {usuariosDisponibles.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Campos para productos */}
      {venta.productos.map((producto, index) => (
        <div key={index} className="space-y-2">
          {/* Combobox para seleccionar el producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Producto</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={producto.id}
              onChange={(e) => handleChange(index, 'id', e.target.value)}
            >
              <option value="">Seleccione un producto</option>
              {productosDisponibles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - ${p.precio}
                </option>
              ))}
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
              value={producto.cantidad || 1} // Valor predeterminado para evitar NaN
              onChange={(e) => handleChange(index, 'cantidad', e.target.value)}
            />
          </div>

          {/* Campo para el precio (modificable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={producto.precio || 0} // Valor predeterminado para evitar NaN
              onChange={(e) => handleChange(index, 'precio', e.target.value)}
            />
          </div>
        </div>
      ))}

      {/* Botón para agregar más productos */}
      <button
        type="button"
        onClick={addProducto}
        className="bg-gray-200 px-4 py-2 rounded-md text-sm"
      >
        + Agregar Producto
      </button>

      {/* Botón para registrar la venta */}
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 block w-full"
      >
        Registrar Venta
      </button>
    </form>
  );
}
