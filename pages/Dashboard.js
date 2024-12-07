"use client";

const { requestToBodyStream } = require("next/dist/server/body-streams");
import { defaultConfig } from 'next/dist/server/config-shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function DashboardPage(){

    const [serverTime, setServerTime] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() =>{
        // hacemos una llamada a la api para obtener la hora del servidor
        async function FetchServerTime() {
            try
            {
                const response = await fetch('/api/now');
                if(!response.ok)
                {
                    throw new Error("Error al obtener la hora del servidor" + response.statusText);
                }
                const data = await response.json();
                setServerTime(data.serverTime);
            }
            catch(error)
            {
                console.error(error.message);
                setError("No se Puedo Obtener la Hora del Servidor");
            }
        }
        FetchServerTime();
    }, []); // solo se ejecuta una vez al cargar la página

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Dashboard</h1>
            {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
            {serverTime && (
                <p className="absolute top-4 right-4 text-sm text-gray-700 bg-white shadow-md rounded px-4 py-2">
                    Hora del servidor: <span className="font-semibold">{new Date(serverTime).toLocaleString()}</span>
                </p>
            )}
        </div>
    );
}  