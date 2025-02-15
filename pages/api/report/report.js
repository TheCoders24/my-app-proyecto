import toast from "react-hot-toast";
import { query } from "../../../lib/db";
import { data } from "autoprefixer";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: "Metodo no permitido" });
    }
    try {
        // Consulta SQL para obtener el reporte
        const reportQuery = `SELECT producto_id, tipo, SUM(cantidad) AS total FROM Movimientos GROUP BY producto_id, tipo`;
        const report = await query(reportQuery);
        res.status(200).json({
            message: "Reporte Generado Correctamente",
            data: report  // <-- esto es lo que el cliente necesita recibir el cliente
        });

    } catch (error) {
        console.error('Error generando reporte:', error);
        res.status(500).json({
            message: 'Error generando reporte',
            error: error.message // Opcional enviar detalles del error
        });
    }
}