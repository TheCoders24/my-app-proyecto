"use client";
import { useEffect, useState} from 'react';

export default function Landing() {
    const [serverTime, setServerTime] = useState(null);

    useEffect(() => {
        const fetchServerTime = async () => {
            try {
                const res = await fetch('/api/now');
                const data = await res.json();
                setServerTime(data.serverTime);
            } catch (err) {
                console.error('Error al obtener hora del servidor:', err);
            }
        };

        fetchServerTime();
    }, []);

    return (
        <div>
        <h1>Hora del servidor</h1>
        {serverTime ? (
            <p>{new Date(serverTime).toLocaleString()}</p>
        ) : (
            <p>Cargando...</p>
        )}
    </div>
    );
}
