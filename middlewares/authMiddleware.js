// middlewares/authMiddleware.js

import jwt, { decode } from "jsonwebtoken"; // importamos la librerias de jsonwebtoken

export default function authMiddleware(handler){
    return async(req, res) => {
        //Extraemos el token del encabezado " Authorization"
        const token = req.headers.authorization?.split(" ")[1];
        
        console.log(token);

        if(!token){
            // Devolemos un mensaje con un estado de codigo 401 y con un mensaje de no autorizado
            return res.status(401).json({ message: "No autorizado: Token no Proporcionado"});
        }
        
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decoded);

            // Agregamos el usuario decodificado al objeto "Req" para usaro en la API
            req.user = decoded;


            // Continuamos con la logica de la api
            return handler(req,res)
        }catch(error){
            return res.status(401).json({ message: "No Autorizado: Token Invalido o Expirado"});
        }
    };
}


export default function VerifyToken(req, res, next){
    const token = req.cookies.token; // Obtenemoos el Token de las Cookis

    if(!token){
        return res.status(401).json({ message: "No Autorizado"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Agregar el usuario decodificado al objeto "req"
        next(); // Continuamos con la siguiente funciones
    }catch(error){
        res.status(401).json({message: "Token Invalido o Expirado"});
    }
}
