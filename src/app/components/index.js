"use client";
import { useEffect, useState} from 'react';

export default function Landing() {
    const [isClient, setIsClient] = useState(false)
    const [serverTime, setServerTime] = useState(null);

    useEffect(() => {
        setIsClient(true)
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
        <h1 style={{textAlign: 'center', color: 'black'}}>Hora del servidor</h1>
        {serverTime ? (
            <p style={{textAlign: 'center'}}>{new Date(serverTime).toLocaleString()}</p>
        ) : (
            <p style={{textAlign: 'center'}}>Cargando...</p>
        )}
    </div>
    );
}
