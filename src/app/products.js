"use client";

import { useEffect, useState } from "react";

export default function Productos() {
    const [error, setError] = useState(null);
    const [productos, setProductos] = useState([]); // Initialized as an empty array
    const [loading, setLoading] = useState(true); // Loading indicator
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const fetchProductos = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/productos');
                console.log('Server response:', res); // Check the response
                if (!res.ok) {
                    throw new Error(`API response error: ${res.statusText}`);
                }
                const data = await res.json();
                console.log('Received data:', data); // Ensure the data is correct
                setProductos(data.productos || []); // Ensure products is an array
            } catch (error) {
                setError("No se pudieron cargar los productos. Inténtalo de nuevo más tarde.");
                console.error('Error fetching products:', error);
            }
        };
        fetchProductos();
    }, []);

    return (
        <div>
            <h1>Productos</h1>
            <h1 style={{ textAlign: 'center' }}>Productos</h1>
            {loading && <p>Cargando productos...</p>} {/* Loading indicator */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && (
                <ul>
                    {productos.length > 0 ? (
                        productos.map((producto) => (
                            <li key={producto.id}>{producto.name}</li> // Adjust according to your product structure
                        ))
                    ) : (
                        <li>No hay productos disponibles.</li>
                    )}
                </ul>
            )}
        </div>
    );
}