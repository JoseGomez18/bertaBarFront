"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, DollarSign, FileText, Plus, Printer } from "lucide-react"
import { FiadoStatus } from "./fiado-status"
import { FiadoPayment } from "./fiado-payment"

type FiadoDetailsProps = {
  fiado: any
  onBack: () => void
  onAddOrder: (fiadoId: string) => void
}

export function FiadoDetails({ fiado, onBack, onAddOrder }: FiadoDetailsProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<any>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handlePayment = (pedidoId?: string) => {
    if (pedidoId) {
      const pedido = fiado.pedidos.find((p: any) => p.id === pedidoId)
      setSelectedPedido(pedido)
    } else {
      setSelectedPedido(null)
    }
    setShowPayment(true)
  }

  const handleClosePayment = () => {
    setShowPayment(false)
    setSelectedPedido(null)
  }

  const handlePrint = () => {
    // Lógica para imprimir el estado de cuenta
    console.log("Imprimiendo estado de cuenta para:", fiado.nombre)
  }

  if (showPayment) {
    return <FiadoPayment fiado={fiado} pedido={selectedPedido} onClose={handleClosePayment} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="rounded-lg p-2 text-gray-400 hover:text-white transition-colors"
            title="Imprimir estado de cuenta"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 p-4" style={{ backgroundColor: "#131c31" }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">{fiado.nombre}</h2>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Cuenta creada: {formatDate(fiado.fechaCreacion)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-orange-500">${fiado.total.toFixed(2)}</div>
            <FiadoStatus status={fiado.estado} />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Pedidos en Fiado</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handlePayment()}
            className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            <DollarSign className="h-4 w-4 inline mr-1" />
            Pagar Cuenta
          </button>
          <button
            onClick={() => onAddOrder(fiado.id)}
            className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Agregar Pedido
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ backgroundColor: "#131c31" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#131c31" }}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Pedido</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Fecha</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Total</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Pagado</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Pendiente</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {fiado.pedidos.map((pedido: any) => {
              const pendiente = pedido.total - pedido.pagado
              return (
                <tr key={pedido.id} className="hover:bg-[#1a253d]" style={{ backgroundColor: "#131c31" }}>
                  <td className="px-4 py-3 text-sm text-white">{pedido.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <div>{formatDate(pedido.fecha)}</div>
                    <div className="text-xs text-gray-400">{formatTime(pedido.fecha)}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-white">${pedido.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-500">${pedido.pagado.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-500">${pendiente.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handlePayment(pedido.id)}
                        className="rounded-full p-1.5 text-white hover:bg-green-600 transition-colors"
                        style={{ backgroundColor: "#1a253d" }}
                        title="Pagar pedido"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-full p-1.5 text-white hover:bg-blue-600 transition-colors"
                        style={{ backgroundColor: "#1a253d" }}
                        title="Ver detalles"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-gray-700 p-4" style={{ backgroundColor: "#131c31" }}>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Resumen de Cuenta</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Pedidos:</span>
            <span className="text-white">${fiado.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Pagado:</span>
            <span className="text-green-500">
              ${fiado.pedidos.reduce((sum: number, pedido: any) => sum + pedido.pagado, 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-700">
            <span className="text-white">Saldo Pendiente:</span>
            <span className="text-orange-500">${fiado.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

