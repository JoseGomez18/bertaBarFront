"use client"

import type React from "react"

import { useState } from "react"
import { Check, Clock, CreditCard, DollarSign, Edit, Printer, Split, Trash, X } from "lucide-react"
import { OrderStatus } from "./order-list"

type OrderDetailsProps = {
  order: any
  onClose: () => void
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status)
  const [isEditing, setIsEditing] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [note, setNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [showSplitBill, setShowSplitBill] = useState(false)
  const [splitCount, setSplitCount] = useState(2)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // Aquí iría la lógica para actualizar el estado del pedido en la base de datos
  }

  const handlePrint = () => {
    // Aquí iría la lógica para imprimir el recibo
    console.log("Imprimiendo recibo del pedido #", order.id)
  }

  const handleDelete = () => {
    // Aquí iría la lógica para eliminar el pedido
    console.log("Eliminando pedido #", order.id)
    onClose()
  }

  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const splitAmount = showSplitBill ? total / splitCount : total

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-border/10 bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Detalles del Pedido #{order.id}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
              title="Imprimir recibo"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`rounded-lg p-2 ${
                isEditing
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
              }`}
              title="Editar pedido"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
              title="Eliminar pedido"
            >
              <Trash className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{order.customerName}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {order.createdAt.toLocaleDateString()}{" "}
                  {order.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
            <OrderStatus status={status} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Productos</h3>
            <div className="rounded-lg border border-border/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/10">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Producto</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground">Cantidad</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Precio</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any) => (
                    <tr key={item.productId} className="border-b border-border/10 last:border-0">
                      <td className="px-4 py-2 text-sm">{item.name}</td>
                      <td className="px-4 py-2 text-center text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-right text-sm">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right text-sm font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border/10">
                    <td colSpan={3} className="px-4 py-2 text-right text-sm">
                      Subtotal
                    </td>
                    <td className="px-4 py-2 text-right text-sm">${subtotal.toFixed(2)}</td>
                  </tr>
                  {isEditing && (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right text-sm">
                        Descuento (%)
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          className="w-16 rounded border border-border/10 bg-secondary/30 px-2 py-1 text-right text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 text-right text-sm text-red-500">-${discountAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  {discount > 0 && !isEditing && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right text-sm">
                        Descuento
                      </td>
                      <td className="px-4 py-2 text-right text-sm text-red-500">-${discountAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="border-t border-border/10 font-medium">
                    <td colSpan={3} className="px-4 py-2 text-right">
                      Total
                    </td>
                    <td className="px-4 py-2 text-right text-primary">${total.toFixed(2)}</td>
                  </tr>
                  {showSplitBill && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <span>Dividir entre</span>
                          <input
                            type="number"
                            min="2"
                            max="10"
                            value={splitCount}
                            onChange={(e) => setSplitCount(Number(e.target.value))}
                            className="w-12 rounded border border-border/10 bg-secondary/30 px-2 py-1 text-center text-sm"
                          />
                          <span>personas</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right text-sm font-medium">${splitAmount.toFixed(2)}</td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>

          {isEditing && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Notas</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agregar notas al pedido..."
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                rows={2}
              />
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Método de Pago</h3>
            <div className="flex gap-2">
              <PaymentButton
                icon={<DollarSign className="h-4 w-4" />}
                label="Efectivo"
                value="cash"
                selected={paymentMethod === "cash"}
                onClick={() => setPaymentMethod("cash")}
                disabled={!isEditing}
              />
              <PaymentButton
                icon={<CreditCard className="h-4 w-4" />}
                label="Tarjeta"
                value="card"
                selected={paymentMethod === "card"}
                onClick={() => setPaymentMethod("card")}
                disabled={!isEditing}
              />
              <button
                onClick={() => setShowSplitBill(!showSplitBill)}
                className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
                  showSplitBill
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/10 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Split className="h-4 w-4" />
                Dividir
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Cambiar Estado</h3>
            <div className="flex gap-2">
              <StatusButton status="pending" currentStatus={status} onClick={() => handleStatusChange("pending")}>
                Pendiente
              </StatusButton>
              <StatusButton
                status="in_progress"
                currentStatus={status}
                onClick={() => handleStatusChange("in_progress")}
              >
                En Preparación
              </StatusButton>
              <StatusButton status="completed" currentStatus={status} onClick={() => handleStatusChange("completed")}>
                Completado
              </StatusButton>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={isEditing ? () => setIsEditing(false) : onClose}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {isEditing ? "Guardar Cambios" : "Cerrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusButton({
  children,
  status,
  currentStatus,
  onClick,
}: {
  children: React.ReactNode
  status: string
  currentStatus: string
  onClick: () => void
}) {
  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    in_progress: "bg-blue-500/20 text-blue-500 border-blue-500/50",
    completed: "bg-green-500/20 text-green-500 border-green-500/50",
  }

  const isActive = status === currentStatus

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
        statusColors[status as keyof typeof statusColors]
      } ${isActive ? "ring-2 ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"}`}
    >
      {isActive && <Check className="h-3 w-3" />}
      {children}
    </button>
  )
}

function PaymentButton({
  icon,
  label,
  value,
  selected,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  value: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border/10 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon}
      {label}
    </button>
  )
}

