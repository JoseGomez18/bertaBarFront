import type React from "react"
import { DollarSign, TrendingUp, Clock, Award } from "lucide-react"

const ResumenDiario: React.FC = () => {
  const resumen = {
    ventasHoy: 3500,
    comparacionAyer: "+15%",
    horasPico: ["19:00 - 21:00", "13:00 - 15:00"],
    mejoresProductos: [
      { nombre: "Cerveza Artesanal", ventas: 45 },
      { nombre: "Margarita", ventas: 32 },
      { nombre: "Nachos", ventas: 28 },
    ],
  }

  return (
    <div className="bg-[#0F2942]/50 backdrop-blur-sm rounded-xl shadow-lg border border-[#1A3A54]/50">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Resumen del Día</h2>

        <div className="space-y-6">
          <div className="bg-[#1A3A54]/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-gray-400">Ventas Totales</span>
              </div>
              <span className="text-white font-bold">${resumen.ventasHoy}</span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">{resumen.comparacionAyer} vs ayer</span>
            </div>
          </div>

          <div className="bg-[#1A3A54]/50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-gray-400">Horas Pico</span>
            </div>
            <div className="space-y-1">
              {resumen.horasPico.map((hora, index) => (
                <div key={index} className="text-white text-sm">
                  {hora}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A3A54]/50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-gray-400">Más Vendidos</span>
            </div>
            <div className="space-y-2">
              {resumen.mejoresProductos.map((producto, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-white text-sm">{producto.nombre}</span>
                  <span className="text-gray-400 text-sm">{producto.ventas} uds</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumenDiario

