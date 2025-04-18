import type React from "react"
import { X, Clock, DollarSign, User } from "lucide-react"

interface Producto {
  nombre: string
  cantidad: number
  precio: number
}

interface Pedido {
  id: number
  cliente: string
  total: number
  hora: string
  duracion: string
  items: number
  productos: Producto[]
  metodoPago: string
}

interface ModalPedidoCompletadoProps {
  pedido: Pedido
  onClose: () => void
}

const ModalPedidoCompletado: React.FC<ModalPedidoCompletadoProps> = ({ pedido, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0F2942] rounded-xl shadow-lg border border-[#1A3A54] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Detalles del Pedido #{pedido.id}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1A3A54]/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-gray-300">Cliente</span>
              </div>
              <span className="text-xl font-bold text-white">{pedido.cliente}</span>
            </div>
            <div className="bg-[#1A3A54]/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-gray-300">Duración</span>
              </div>
              <span className="text-2xl font-bold text-white">{pedido.duracion}</span>
            </div>
            <div className="bg-[#1A3A54]/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-gray-300">Total</span>
              </div>
              <span className="text-2xl font-bold text-white">${pedido.total}</span>
            </div>
            <div className="bg-[#1A3A54]/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-gray-300">Método de Pago</span>
              </div>
              <span className="text-xl font-bold text-white">{pedido.metodoPago}</span>
            </div>
          </div>

          <div className="bg-[#1A3A54]/30 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Productos</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-2">Producto</th>
                  <th className="pb-2">Cantidad</th>
                  <th className="pb-2">Precio</th>
                  <th className="pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {pedido.productos.map((producto, index) => (
                  <tr key={index} className="border-t border-[#1A3A54]">
                    <td className="py-2 text-white">{producto.nombre}</td>
                    <td className="py-2 text-white">{producto.cantidad}</td>
                    <td className="py-2 text-white">${producto.precio}</td>
                    <td className="py-2 text-white">${producto.cantidad * producto.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalPedidoCompletado

