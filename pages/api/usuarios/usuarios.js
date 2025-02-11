import { query } from "../../../lib/db";

export default async function GET(req, res) {
   if(req.method === "GET")
    {
        try 
        {
            const result = await query('SELECT id, nombre FROM Usuarios');
            res.status(200).json(result.rows);
        } 
        catch (error) 
        {
            return new Response(JSON.stringify({ message: 'Error al obtener usuarios' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    //manejamos otros metodos HTTP
    else{
        res.status(405).json({ message: 'Metodo no  permitido' });
    }
  }
  