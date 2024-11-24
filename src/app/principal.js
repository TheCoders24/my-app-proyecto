"use client";

import { useState, useEffect } from "react";
import LoginPage from "./loginpage";
import RegisterPage from "./registerpages";

const Principal = () => {
    const [isLogin, setIsLogin] = useState(true); // Estado para controlar qué vista mostrar
    const [isClient, setIsClient] = useState(false)


    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return null;
    }
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="absolute top-4 right-4 flex gap-4">
                <button
                    className={`w-30 p-2 text-lg rounded-lg ${isLogin ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                        } hover:bg-blue-700 transition duration-300`}
                    onClick={() => setIsLogin(true)}
                >
                    Iniciar sesión
                </button>
                <button
                    className={`w-30 p-4 text-lg rounded-lg ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700" }
                        } hover:bg-blue-700 transition duration-300`}
                    onClick={() => setIsLogin(false)}
                >
                    Registrarse
                </button>
            </div>
            <div>
                {isLogin ? <LoginPage /> : <RegisterPage />}
            </div>
        </div>

    );
};

export default Principal;