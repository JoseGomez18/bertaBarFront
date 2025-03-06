import type React from "react"
import { Check, Clock, DollarSign } from "lucide-react"

const pedidosCompletadosEjemplo = [
  {
    id: 101,
    cliente: "Laura Sánchez",
    total: 45,
    hora: "18:30",
    duracion: "35 min",
    items: 4,
    productos: [
      { nombre: "Cerveza Artesanal", cantidad: 2, precio: 5 },
      { nombre: "Nachos con Queso", cantidad: 1, precio: 8 },
      { nombre: "Alitas de Pollo", cantidad: 1, precio: 12 },
    ],
    metodoPago: "Tarjeta de crédito",
  },
  {
    id: 102,
    cliente: "Pedro Gómez",
    total: 62,
    hora: "19:45",
    duracion: "28 min",
    items: 6,
    productos: [
      { nombre: "Margarita", cantidad: 2, precio: 7 },
      { nombre: "Tacos de Pescado", cantidad: 3, precio: 9 },
      { nombre: "Guacamole", cantidad: 1, precio: 5 },
    ],
    metodoPago: "Efectivo",
  },
  {
    id: 103,
    cliente: "Isabel Torres",
    total: 28,
    hora: "20:30",
    duracion: "22 min",
    items: 3,
    productos: [
      { nombre: "Mojito", cantidad: 1, precio: 6 },
      { nombre: "Hamburguesa Clásica", cantidad: 1, precio: 12 },
      { nombre: "Papas Fritas", cantidad: 1, precio: 4 },
    ],
    metodoPago: "Tarjeta de débito",
  },
  {
    id: 104,
    cliente: "Grupo Familiar",
    total: 55,
    hora: "21:15",
    duracion: "40 min",
    items: 5,
    productos: [
      { nombre: "Vino Tinto", cantidad: 1, precio: 15 },
      { nombre: "Ensalada César", cantidad: 1, precio: 10 },
      { nombre: "Pasta Alfredo", cantidad: 1, precio: 18 },
      { nombre: "Tiramisú", cantidad: 1, precio: 7 },
      { nombre: "Café Espresso", cantidad: 1, precio: 5 },
    ],
    metodoPago: "Tarjeta de crédito",
  },
  {
    id: 105,
    cliente: "Javier Ruiz",
    total: 40,
    hora: "22:00",
    duracion: "25 min",
    items: 4,
    productos: [
      { nombre: "Cerveza Artesanal", cantidad: 2, precio: 6 },
      { nombre: "Pizza Margherita", cantidad: 1, precio: 14 },
      { nombre: "Brownie con Helado", cantidad: 1, precio: 8 },
    ],
    metodoPago: "Efectivo",
  },
]

interface PedidosCompletadosProps {
  onPedidoClick: (pedido: any) => void
}

const PedidosCompletados: React.FC<PedidosCompletadosProps> = ({ onPedidoClick }) => {
  return (
    <div className="bg-[#0F2942]/50 backdrop-blur-sm rounded-xl shadow-lg border border-[#1A3A54]/50">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Pedidos Completados</h2>
        <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          {pedidosCompletadosEjemplo.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-[#1A3A54]/30 rounded-lg p-3 border border-[#1A3A54]/50 cursor-pointer hover:bg-[#1A3A54]/50 transition-colors"
              onClick={() => onPedidoClick(pedido)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/20 p-1.5 rounded-full">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">{pedido.cliente}</span>
                </div>
                <span className="text-white font-bold">${pedido.total}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pedido.duracion}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {pedido.metodoPago}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PedidosCompletados

