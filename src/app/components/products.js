"use client"; // Asegúrate de que esto esté en la parte superior

import {  useEffect, useState } from 'react';
import React, { useReducer } from 'react';

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
    <div>
      <h1>Productos</h1>
      <form onSubmit={agregarProducto}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
        <button type="submit">Agregar Producto</button>
      </form>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - {producto.precio} - {producto.cantidad_en_stock}
            <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductosPage;