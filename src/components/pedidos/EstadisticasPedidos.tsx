import type React from "react"
import { Clock, DollarSign, Users, Star } from "lucide-react"

const EstadisticasPedidos: React.FC = () => {
  const estadisticas = {
    tiempoPromedio: "22 min",
    satisfaccion: "4.7/5",
    pedidosPendientes: 12,
    ventasHoy: 1250,
  }

  return (
    <div className="bg-[#0F2942]/50 backdrop-blur-sm rounded-xl shadow-lg border border-[#1A3A54]/50">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Estadísticas en Vivo</h2>
        <div className="grid gap-4">
          <div className="bg-[#1A3A54]/50 rounded-lg p-4 flex items-center">
            <Clock className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Tiempo Promedio</p>
              <p className="text-xl font-bold text-white">{estadisticas.tiempoPromedio}</p>
            </div>
          </div>

          <div className="bg-[#1A3A54]/50 rounded-lg p-4 flex items-center">
            <Star className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Satisfacción</p>
              <p className="text-xl font-bold text-white">{estadisticas.satisfaccion}</p>
            </div>
          </div>

          <div className="bg-[#1A3A54]/50 rounded-lg p-4 flex items-center">
            <Users className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Pedidos Pendientes</p>
              <p className="text-xl font-bold text-white">{estadisticas.pedidosPendientes}</p>
            </div>
          </div>

          <div className="bg-[#1A3A54]/50 rounded-lg p-4 flex items-center">
            <DollarSign className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Ventas de Hoy</p>
              <p className="text-xl font-bold text-white">${estadisticas.ventasHoy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasPedidos

