"use client";

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function StockChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Referencia para almacenar la instancia del gráfico

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destruir el gráfico anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Crear un nuevo gráfico
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Stock',
              data: data.values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Limpiar el gráfico cuando el componente se desmonte
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Dependencia: se ejecuta cuando `data` cambia

  return <canvas ref={chartRef} />;
}