"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import FormProducto from '../components/productoforms';
import FormMovimiento from '../components/movimientoforms';
import FormVenta from '../components/ventaforms';
import FormularioCategoria from "../components/categoriaforms";
import FormularioProveedor from "../components/proveedoresforms";
import StockChart from '../components/StockChart';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalSales: 0,
    recentMovements: [],
    loading: true,
    error: null,
  });

  const [showModal, setShowModal] = useState(null);
  const router = useRouter();

  const [stockData, setStockData] = useState({ // Declara el estado stockData
    labels: [], // Nombres de los productos
    values: [], // Cantidades en stock
  });
  console.log(stockData)
  console.log(setStockData)

  // Cargar datos iniciales
  const fetchDashboardData = async () => {
    try {
      const [productsRes, lowStockRes, salesRes, movementsRes] = await Promise.all([
        fetch('/api/stats/products').then(res => {
          if (!res.ok) throw new Error('Error al obtener productos');
          return res.json();
        }),
        fetch('/api/stats/low-stock').then(res => {
          if (!res.ok) throw new Error('Error al obtener productos con stock bajo');
          return res.json();
        }),
        fetch('/api/stats/sales').then(res => {
          if (!res.ok) throw new Error('Error al obtener ventas');
          return res.json();
        }),
        fetch('/api/movements/recent/route').then(res => {
          if (!res.ok) throw new Error('Error al obtener movimientos recientes');
          return res.json();
        }),
      ]);
  
      // Depuración: Verificar la respuesta de la API
      console.log('Respuesta de la API de productos:', productsRes);
  
      // Verificar si productsRes.data existe antes de usar .map()
      if (!productsRes.data) {
        throw new Error('La respuesta de la API no contiene datos de productos');
      }
  
      // Extraer nombres y stock de los productos
      const productLabels = productsRes.data.map(product => product.nombre);
      const productValues = productsRes.data.map(product => product.stock);
  
      setStats({
        totalProducts: productsRes.total || 0,
        lowStock: lowStockRes.count || 0,
        totalSales: salesRes.total || 0,
        recentMovements: movementsRes.data || [],
        loading: false,
        error: null,
      });
  
      // Actualizar los datos del gráfico
      setStockData({
        labels: productLabels,
        values: productValues,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Error al cargar los datos",
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Manejar cierre de modal y actualizar datos
  const handleModalClose = () => {
    setShowModal(null);
    fetchDashboardData();
    router.refresh();
  };

  // Acciones rápidas
  const handleQuickAction = async (action) => {
    try {
      const response = await fetch(`/api/quick/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad: 10 }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error en acción rápida:", error);
    }
  };

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando datos...</div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          ⚠️ {stats.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header y Botones de Acción */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Inventario</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowModal('producto')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo Producto
          </button>
          <button
            onClick={() => setShowModal('Categoria')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            + Nueva Categoría
          </button>
          <button
            onClick={() => setShowModal('proveedor')}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            + Nuevo Proveedor
          </button>
          <button
            onClick={() => setShowModal('movimiento')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Registrar Movimiento
          </button>
          <button
            onClick={() => setShowModal('venta')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Nueva Venta
          </button>
        </div>
      </div>

      {/* Modales */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {showModal === 'producto' && <FormProducto onSuccess={handleModalClose} onCancel={handleModalClose} />}
            {showModal === 'movimiento' && <FormMovimiento onSuccess={handleModalClose} onCancel={handleModalClose} />}
            {showModal === 'venta' && <FormVenta onSuccess={handleModalClose} onCancel={handleModalClose} />}
            {showModal === 'proveedor' && <FormularioProveedor onSuccess={handleModalClose} onCancel={handleModalClose} />}
            {showModal === 'Categoria' && <FormularioCategoria onSuccess={handleModalClose} onCancel={handleModalClose} />}
          </div>
        </div>
      )}

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Productos en Inventario</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Productos con Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600">{stats.lowStock}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Ventas (30 días)</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalSales.toFixed(2)}</p>
        </div>
      </div>

      {/* Gráficos y Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Movimientos Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="pb-3">Producto</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Cantidad</th>
                  <th className="pb-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMovements.map((mov, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-3">{mov.producto}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        mov.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 
                        mov.tipo === 'salida' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="py-3">{mov.cantidad}</td>
                    <td className="py-3 text-gray-500">{new Date(mov.fecha).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Distribución de Stock</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <StockChart data={stockData} />
          </div>
        </div>
      </div>

      {/* Sección de Acciones Rápidas */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => handleQuickAction('ajuste')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="text-blue-600 text-2xl mb-2">🔄</div>
            <span className="text-gray-600">Ajustar Inventario</span>
          </div>
        </button>
        
        <button 
          onClick={() => handleQuickAction('entrada')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="text-green-600 text-2xl mb-2">📦</div>
            <span className="text-gray-600">Entrada Rápida</span>
          </div>
        </button>
        
        <button 
          onClick={() => handleQuickAction('salida')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="text-red-600 text-2xl mb-2">📤</div>
            <span className="text-gray-600">Salida Rápida</span>
          </div>
        </button>
        
        <button 
          onClick={() => window.print()}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="text-purple-600 text-2xl mb-2">📊</div>
            <span className="text-gray-600">Generar Reporte</span>
          </div>
        </button>
      </div>
    </div>
  );
}