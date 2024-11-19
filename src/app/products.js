"use client";
import { useEffect, useState } from "react";

export default function Productos() {
    const [error, setError] = useState(null);
    const [productos, setProductos] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await fetch('/api/productos');
                if (!res.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await res.json();
                setProductos(data); // Asegúrate de que data sea un array
                console.log('Productos obtenidos:', data);
            } catch (error) {
                setError(error.message);
                console.error('Error al obtener la consulta:', error);
            }
        };
        fetchProductos();
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Productos</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <ul>
                {productos.length > 0 ? (
                    productos.map((producto) => (
                        <li key={producto.id}>{producto.name}</li> // Ajusta según la estructura de tu producto
                    ))
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </ul>
        </div>
    );
}