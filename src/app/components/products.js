"use client"; // Asegúrate de que esto esté en la parte superior

import { useEffect, useState } from 'react';
import React from 'react';

const ProductosPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  useEffect(() =>{
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const fetchProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        if (!res.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductos();
  }, [isClient]);

  const agregarProducto = async (e) => {
    e.preventDefault();
    const nuevoProducto = { 
      nombre, 
      descripcion, 
      precio: parseFloat(precio), 
      cantidad_en_inventario: parseInt(cantidad) 
    };
    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });
      if (!res.ok) {
        throw new Error('Error al agregar el producto');
      }
      const productoCreado = await res.json();
      setProductos([...productos, productoCreado]);
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setCantidad('');
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarProducto = async (producto_id) => {
    try {
      const res = await fetch('/api/productos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ producto_id }),
      });
      if (!res.ok) {
        throw new Error('Error al eliminar el producto');
      }
      setProductos(productos.filter((producto) => producto.producto_id !== producto_id));
    } catch (error) {
      console.error(error);
    }
  };

  if(!isClient){
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Productos</h1>
      
      <form 
        onSubmit={agregarProducto} 
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4 flex space-x-4">
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Agregar Producto
        </button>
      </form>
      
      {/* Nueva tabla */}
      <div className="bg-white shadow-md rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 border-b">
              <th className="p-3 text-left text-black font-bold">ID</th>
              <th className="p-3 text-left text-black font-bold">Nombre</th>
              <th className="p-3 text-left text-black font-bold">Descripción</th>
              <th className="p-3 text-left text-black font-bold">Precio</th>
              <th className="p-3 text-left text-black font-bold">Stock</th>
              <th className="p-3 text-left text-black font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr 
                key={producto.producto_id} 
                className="border-b hover:bg-blue-50 transition duration-300"
              >
                <td className="p-3 text-black">{producto.producto_id}</td>
                <td className="p-3 text-black">{producto.nombre}</td>
                <td className="p-3 text-black">{producto.descripcion || 'Sin descripción'}</td>
                <td className="p-3 text-black">${producto.precio}</td>
                <td className="p-3 text-black">{producto.cantidad_en_inventario}</td>
                <td className="p-3">
                  <button 
                    onClick={() => eliminarProducto(producto.producto_id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductosPage;