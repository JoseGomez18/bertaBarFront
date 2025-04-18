import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp, Clock, Utensils } from "lucide-react"

const pedidosEjemplo = [
  {
    id: 1,
    cliente: "Juan Pérez",
    productos: [
      { nombre: "Cerveza Artesanal", cantidad: 2, precio: 5 },
      { nombre: "Nachos con Guacamole", cantidad: 1, precio: 8 },
      { nombre: "Alitas de Pollo", cantidad: 1, precio: 10 },
    ],
    estado: "pendiente",
    total: 28,
    hora: "19:30",
    tiempoEstimado: "25 min",
    prioridad: "alta",
    notas: "Cliente regular, prefiere la cerveza bien fría",
  },
  {
    id: 2,
    cliente: "María García",
    productos: [
      { nombre: "Margarita", cantidad: 2, precio: 7 },
      { nombre: "Tacos de Pescado", cantidad: 3, precio: 9 },
      { nombre: "Guacamole", cantidad: 1, precio: 5 },
    ],
    estado: "en_preparacion",
    total: 48,
    hora: "20:15",
    tiempoEstimado: "30 min",
    prioridad: "media",
    notas: "Solicitan salsa picante extra",
  },
  {
    id: 3,
    cliente: "Carlos Rodríguez",
    productos: [
      { nombre: "Mojito", cantidad: 2, precio: 6 },
      { nombre: "Hamburguesa Vegana", cantidad: 1, precio: 12 },
      { nombre: "Papas Fritas", cantidad: 1, precio: 4 },
    ],
    estado: "listo",
    total: 28,
    hora: "20:45",
    tiempoEstimado: "5 min",
    prioridad: "baja",
    notas: "Asegurarse de que la hamburguesa sea 100% vegana",
  },
  {
    id: 4,
    cliente: "Ana Martínez",
    productos: [
      { nombre: "Piña Colada", cantidad: 1, precio: 8 },
      { nombre: "Ensalada César", cantidad: 1, precio: 9 },
      { nombre: "Sopa del Día", cantidad: 1, precio: 6 },
    ],
    estado: "pendiente",
    total: 23,
    hora: "21:00",
    tiempoEstimado: "20 min",
    prioridad: "media",
    notas: "Cliente alérgico a los frutos secos",
  },
  {
    id: 5,
    cliente: "Grupo Empresarial",
    productos: [
      { nombre: "Whisky on the Rocks", cantidad: 2, precio: 10 },
      { nombre: "Tabla de Quesos", cantidad: 1, precio: 15 },
    ],
    estado: "en_preparacion",
    total: 35,
    hora: "21:30",
    tiempoEstimado: "15 min",
    prioridad: "alta",
    notas: "Clientes VIP, atención especial",
  },
]

const ListadoPedidos: React.FC = () => {
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null)

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      case "en_preparacion":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "listo":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "media":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "baja":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  return (
    <div className="bg-[#0F2942]/50 backdrop-blur-sm rounded-xl shadow-lg border border-[#1A3A54]/50">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Pedidos Activos</h2>
        <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          {pedidosEjemplo.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-[#1A3A54]/30 rounded-lg overflow-hidden border border-[#1A3A54]/50 transition-all duration-200 hover:border-blue-500/50"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-white">{pedido.cliente}</span>
                    <div>
                      <span className="text-sm text-gray-400">{pedido.hora}</span>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getEstadoColor(pedido.estado)}`}>
                          {pedido.estado}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getPrioridadColor(pedido.prioridad)}`}
                        >
                          {pedido.prioridad}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-white">${pedido.total}</span>
                    {expandedPedido === pedido.id ? (
                      <ChevronUp className="text-gray-400" />
                    ) : (
                      <ChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedPedido === pedido.id && (
                <div className="p-4 bg-[#1A3A54]/50 border-t border-[#1A3A54]">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="flex items-center text-gray-400">
                      <Clock size={16} className="mr-1" /> Tiempo estimado: {pedido.tiempoEstimado}
                    </span>
                    <span className="flex items-center text-gray-400">
                      <Utensils size={16} className="mr-1" /> {pedido.productos.length} productos
                    </span>
                  </div>

                  <div className="bg-[#0F2942]/50 rounded-lg p-3 mb-4">
                    {pedido.productos.map((producto, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-[#1A3A54] last:border-b-0"
                      >
                        <div>
                          <span className="text-white">{producto.nombre}</span>
                          <span className="text-gray-400 text-sm ml-2">x{producto.cantidad}</span>
                        </div>
                        <span className="text-white">${producto.precio * producto.cantidad}</span>
                      </div>
                    ))}
                  </div>

                  {pedido.notas && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                      <h4 className="text-yellow-400 font-semibold mb-1">Notas:</h4>
                      <p className="text-gray-300 text-sm">{pedido.notas}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors">
                      Actualizar Estado
                    </button>
                    <button className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
                      Cancelar Pedido
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListadoPedidos

