"use client"; // Asegúrate de que esto esté en la parte superior

import {  useEffect, useState } from 'react';
import React from 'react';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  useEffect(() => {
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
  }, []);

  const agregarProducto = async (e) => {
    e.preventDefault();
    const nuevoProducto = { 
      nombre, 
      descripcion, 
      precio: parseFloat(precio), 
      cantidad_en_stock: parseInt(cantidad) 
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

  const eliminarProducto = async (id) => {
    try {
      const res = await fetch('/api/productos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error('Error al eliminar el producto');
      }
      setProductos(productos.filter((producto) => producto.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
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
      
      <ul className="space-y-4">
        {productos.map((producto) => (
          <li 
            key={producto.id} 
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <span className="font-semibold">{producto.nombre}</span>
              <span className="ml-4 text-gray-600">
                Precio: ${producto.precio} - Stock: {producto.cantidad_en_stock}
              </span>
            </div>
            <button 
              onClick={() => eliminarProducto(producto.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductosPage;