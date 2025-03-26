"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRightLeft, Check, CreditCard, DollarSign, Receipt, X } from "lucide-react"

type FiadoPaymentProps = {
  fiado: any
  pedido: any | null
  onClose: () => void
}

export function FiadoPayment({ fiado, pedido, onClose }: FiadoPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash")
  const [paymentAmount, setPaymentAmount] = useState(pedido ? pedido.total - pedido.pagado : fiado.total)
  const [change, setChange] = useState(0)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value)
    setPaymentAmount(amount)
    if (paymentMethod === "cash" && amount > totalPendiente) {
      setChange(amount - totalPendiente)
    } else {
      setChange(0)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "cash" && paymentAmount < totalPendiente) {
      alert("El monto recibido es menor al total pendiente")
      return
    }

    // Aquí iría la lógica para procesar el pago
    console.log("Procesando pago:", {
      fiadoId: fiado.id,
      pedidoId: pedido?.id || "pago_completo",
      method: paymentMethod,
      amount: Math.min(paymentAmount, totalPendiente),
    })

    setPaymentCompleted(true)
  }

  const totalPendiente = pedido ? pedido.total - pedido.pagado : fiado.total

  // Si el pago está completado, mostrar recibo
  if (paymentCompleted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Pago Completado</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="rounded-full bg-green-500/20 p-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-white">¡Pago Procesado!</h3>
          <p className="text-center text-gray-400">
            El pago para la cuenta de {fiado.nombre} ha sido procesado correctamente.
          </p>

          <div className="w-full rounded-lg border border-gray-700 p-4 mt-4" style={{ backgroundColor: "#131c31" }}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Cliente:</span>
              <span className="text-white">{fiado.nombre}</span>
            </div>

            {pedido && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Pedido:</span>
                <span className="text-white">{pedido.id}</span>
              </div>
            )}

            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Monto pagado:</span>
              <span className="text-green-500">${Math.min(paymentAmount, totalPendiente).toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-4 font-bold border-t border-gray-700 pt-2">
              <span className="text-white">Método de pago:</span>
              <span className="text-white">
                {paymentMethod === "cash" ? "Efectivo" : paymentMethod === "card" ? "Tarjeta" : "Transferencia"}
              </span>
            </div>

            {paymentMethod === "cash" && change > 0 && (
              <div className="flex justify-between font-bold">
                <span className="text-white">Cambio:</span>
                <span className="text-orange-500">${change.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Receipt className="h-4 w-4" />
            Cerrar e Imprimir Recibo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-lg border border-gray-700 p-4" style={{ backgroundColor: "#131c31" }}>
        <h2 className="text-lg font-semibold text-white mb-4">
          {pedido ? `Pago de Pedido #${pedido.id}` : `Pago de Cuenta - ${fiado.nombre}`}
        </h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-700 p-4" style={{ backgroundColor: "#090f1e" }}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Cliente:</span>
              <span className="text-white">{fiado.nombre}</span>
            </div>

            {pedido && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Pedido:</span>
                  <span className="text-white">{pedido.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total del pedido:</span>
                  <span className="text-white">${pedido.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Ya pagado:</span>
                  <span className="text-green-500">${pedido.pagado.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between font-medium border-t border-gray-700 pt-2 mt-2">
              <span className="text-white">Total pendiente:</span>
              <span className="text-orange-500 text-lg">${totalPendiente.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Método de Pago</h3>
            <div className="flex flex-wrap gap-2">
              <PaymentButton
                icon={<DollarSign className="h-4 w-4" />}
                label="Efectivo"
                value="cash"
                selected={paymentMethod === "cash"}
                onClick={() => setPaymentMethod("cash")}
              />
              <PaymentButton
                icon={<CreditCard className="h-4 w-4" />}
                label="Tarjeta"
                value="card"
                selected={paymentMethod === "card"}
                onClick={() => setPaymentMethod("card")}
              />
              <PaymentButton
                icon={<ArrowRightLeft className="h-4 w-4" />}
                label="Transferencia"
                value="transfer"
                selected={paymentMethod === "transfer"}
                onClick={() => setPaymentMethod("transfer")}
              />
            </div>
          </div>

          {paymentMethod === "cash" && (
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Monto Recibido</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={handlePaymentAmountChange}
                  className="w-full rounded-lg border border-gray-700 pl-7 pr-3 py-2 text-right text-white"
                  style={{ backgroundColor: "#131c31" }}
                  min={0}
                  step="0.01"
                />
              </div>

              {change > 0 && (
                <div className="rounded-lg p-3 text-sm" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cambio:</span>
                    <span className="text-green-500 font-medium">${change.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentMethod === "transfer" && (
            <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}>
              <h4 className="font-medium text-white">Datos de Transferencia</h4>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-400">Banco:</span>
                  <span className="text-white">Banco Example</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Cuenta:</span>
                  <span className="text-white">1234-5678-9012-3456</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Titular:</span>
                  <span className="text-white">Bar Example S.A.</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handlePayment}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Procesar Pago
        </button>
      </div>
    </div>
  )
}

function PaymentButton({
  icon,
  label,
  value,
  selected,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  value: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? "border-orange-500 bg-orange-500/10 text-orange-500"
          : "border-gray-700 text-gray-300 hover:text-white"
      }`}
      style={{ backgroundColor: selected ? "rgba(249, 115, 22, 0.1)" : "#131c31" }}
    >
      {icon}
      {label}
    </button>
  )
}

