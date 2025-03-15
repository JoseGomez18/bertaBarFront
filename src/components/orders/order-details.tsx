"use client"

import type React from "react"

import { useState } from "react"
import {
  Check,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  FileText,
  Printer,
  Split,
  Trash,
  X,
  Receipt,
  Plus,
  Minus,
  ArrowRightLeft,
} from "lucide-react"
import { OrderStatus } from "./order-list"

type OrderDetailsProps = {
  order: any
  onClose: () => void
}

// Add this utility function at the top of the file
function formatTime(date: Date) {
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
  })  
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status)
  const [isEditing, setIsEditing] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [serviceCharge, setServiceCharge] = useState(0)
  const [note, setNote] = useState(order.note || "")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">(order.paymentMethod || "cash")
  const [showSplitBill, setShowSplitBill] = useState(false)
  const [splitCount, setSplitCount] = useState(2)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [change, setChange] = useState(0)
  const [orderCompleted, setOrderCompleted] = useState(false)

  // Estado para los cargos de servicio por ítem
  const [itemServiceCharges, setItemServiceCharges] = useState<Record<number, number>>({})

  // Añadir estos estados después de los otros estados
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // Aquí iría la lógica para actualizar el estado del pedido en la base de datos
  }

  const handlePrint = () => {
    // Aquí iría la lógica para imprimir el recibo
    console.log("Imprimiendo recibo del pedido #", order.id)
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    // Aquí iría la lógica para eliminar el pedido
    console.log("Eliminando pedido #", order.id)
    setShowDeleteConfirmation(false)
    onClose()
  }

  const handleSaveChanges = () => {
    setShowSaveConfirmation(true)
  }

  const confirmSaveChanges = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log("Guardando cambios del pedido #", order.id)
    setShowSaveConfirmation(false)
    setIsEditing(false)
  }

  const handlePayment = () => {
    if (paymentMethod === "cash" && paymentAmount < total) {
      alert("El monto recibido es menor al total")
      return
    }

    // Process payment...
    console.log("Procesando pago:", {
      orderId: order.id,
      method: paymentMethod,
      total,
      paymentAmount: paymentMethod === "cash" ? paymentAmount : total,
      change: paymentMethod === "cash" ? change : 0,
    })

    // Mark order as completed
    setOrderCompleted(true)
  }

  const handleServiceChargeChange = (productId: number, value: number) => {
    setItemServiceCharges({
      ...itemServiceCharges,
      [productId]: value,
    })
  }

  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discount) / 100

  // Calcular el cargo por servicio sumando los cargos individuales por ítem
  const serviceChargeAmount = Object.values(itemServiceCharges).reduce((sum: number, charge: number) => sum + charge, 0)

  const total = subtotal - discountAmount + serviceChargeAmount

  const splitAmount = showSplitBill ? total / splitCount : total

  // If order is completed, show receipt
  if (orderCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-lg border border-border/10 bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Pedido Completado</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="rounded-full bg-green-500/20 p-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">¡Pedido Completado!</h3>
            <p className="text-center text-muted-foreground">
              El pedido para {order.customerName} ha sido procesado correctamente.
            </p>

            <div className="w-full rounded-lg border border-border/10 bg-secondary/20 p-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between mb-2 text-red-500">
                  <span>Descuento ({discount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              {serviceChargeAmount > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Servicio:</span>
                  <span>${serviceChargeAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mb-4 font-bold border-t border-border/10 pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Método de pago:</span>
                <span>
                  {paymentMethod === "cash" ? "Efectivo" : paymentMethod === "card" ? "Tarjeta" : "Transferencia"}
                </span>
              </div>

              {paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between mb-2">
                    <span>Recibido:</span>
                    <span>${paymentAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Cambio:</span>
                    <span>${change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Receipt className="h-4 w-4" />
              Cerrar e Imprimir Recibo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-border/10 bg-card p-6 shadow-lg my-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              {isProcessingPayment ? `Procesar Pago - ${order.customerName}` : `Detalles del Pedido #${order.id}`}
            </h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(order.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isProcessingPayment && (
              <>
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
              </>
            )}
            <button
              onClick={() => {
                if (isProcessingPayment) {
                  setIsProcessingPayment(false)
                } else {
                  onClose()
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {!isProcessingPayment ? (
            // Vista de detalles del pedido
            <>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium">{order.customerName}</h3>
                </div>
                <OrderStatus status={status} />
              </div>

              {/* Products Table */}
              <div className="rounded-lg border border-border/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/30">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Producto</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground">Cantidad</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Precio</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any) => (
                      <tr key={item.productId} className="border-t border-border/10">
                        <td className="px-4 py-2 text-sm">
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            {isEditing && (
                              <button
                                type="button"
                                className="mt-1 text-xs text-primary flex items-center"
                                onClick={() => {
                                  // Mostrar un prompt para ingresar el monto del servicio
                                  const amount = prompt(
                                    "Ingrese el monto del servicio:",
                                    itemServiceCharges[item.productId]?.toString() || "0",
                                  )
                                  if (amount !== null) {
                                    handleServiceChargeChange(item.productId, Number.parseFloat(amount) || 0)
                                  }
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {itemServiceCharges[item.productId]
                                  ? `Servicio: $${itemServiceCharges[item.productId]}`
                                  : "Agregar servicio"}
                              </button>
                            )}
                            {!isEditing && itemServiceCharges[item.productId] > 0 && (
                              <span className="text-xs text-primary">
                                Servicio: ${itemServiceCharges[item.productId]}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-right text-sm">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right text-sm font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-secondary/20">
                    <tr className="border-t border-border/10">
                      <td colSpan={3} className="px-4 py-2 text-right text-sm font-medium">
                        Subtotal
                      </td>
                      <td className="px-4 py-2 text-right text-sm font-medium">${subtotal.toFixed(2)}</td>
                    </tr>
                    {isEditing && (
                      <tr>
                        <td colSpan={2} className="px-4 py-2 text-right text-sm">
                          Descuento (%)
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                            className="w-20 rounded border border-border/10 bg-secondary/30 px-2 py-1 text-right text-sm"
                          />
                        </td>
                        <td className="px-4 py-2 text-right text-sm text-red-500">-${discountAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    {serviceChargeAmount > 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-sm">
                          Servicio
                        </td>
                        <td className="px-4 py-2 text-right text-sm">${serviceChargeAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="border-t border-border/10 font-medium">
                      <td colSpan={3} className="px-4 py-2 text-right">
                        Total
                      </td>
                      <td className="px-4 py-2 text-right text-primary">${total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Notas del pedido
                  </div>
                </label>
                {isEditing ? (
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Agregar notas al pedido..."
                    className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm"
                    rows={2}
                  />
                ) : (
                  <div className="rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm min-h-[4rem]">
                    {note || "Sin notas"}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Método de Pago</h3>
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

              {/* Split Bill Section */}
              {showSplitBill && (
                <div className="rounded-lg border border-border/10 bg-secondary/20 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Dividir Cuenta</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                        className="rounded-full bg-secondary/30 p-1 hover:bg-secondary/50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-6 text-center">{splitCount}</span>
                      <button
                        onClick={() => setSplitCount(splitCount + 1)}
                        className="rounded-full bg-secondary/30 p-1 hover:bg-secondary/50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm font-medium bg-primary/10 p-3 rounded-lg">
                    <span>Monto por persona:</span>
                    <span className="text-primary">${splitAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Order Status */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Estado del Pedido</h3>
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
                  <StatusButton
                    status="completed"
                    currentStatus={status}
                    onClick={() => handleStatusChange("completed")}
                  >
                    Completado
                  </StatusButton>
                </div>
              </div>
            </>
          ) : (
            // Vista de procesamiento de pago
            <div className="space-y-6">
              <div className="rounded-lg border border-border/10 bg-secondary/20 p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between mb-2 text-red-500">
                    <span className="text-sm">Descuento ({discount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {serviceChargeAmount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Servicio:</span>
                    <span>${serviceChargeAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium border-t border-border/10 pt-2 mt-2">
                  <span>Total a pagar:</span>
                  <span className="text-primary text-lg">${total.toFixed(2)}</span>
                </div>

                {showSplitBill && (
                  <div className="mt-3 pt-2 border-t border-border/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Dividir entre:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                          className="rounded-full bg-secondary/30 p-1 hover:bg-secondary/50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-medium">{splitCount}</span>
                        <button
                          onClick={() => setSplitCount(splitCount + 1)}
                          className="rounded-full bg-secondary/30 p-1 hover:bg-secondary/50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm font-medium bg-primary/10 p-2 rounded-lg">
                      <span>Monto por persona:</span>
                      <span className="text-primary">${splitAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {paymentMethod === "cash" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Monto Recibido</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => {
                          const amount = Number(e.target.value)
                          setPaymentAmount(amount)
                          setChange(Math.max(0, amount - total))
                        }}
                        className="w-full rounded-lg border border-border/10 bg-secondary/20 pl-7 pr-3 py-2 text-right"
                        min={0}
                        step="0.01"
                      />
                    </div>
                  </div>

                  {change > 0 && (
                    <div className="rounded-lg bg-green-500/10 p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cambio:</span>
                        <span className="text-green-500 font-medium">${change.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="rounded-lg bg-blue-500/10 p-4 space-y-3">
                  <h4 className="font-medium">Datos de Transferencia</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Banco:</span>
                      <span>Banco Example</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Cuenta:</span>
                      <span>1234-5678-9012-3456</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Titular:</span>
                      <span>Bar Example S.A.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border/10">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Guardar Cambios
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsProcessingPayment(true)}
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                Procesar Pago
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
      {/* Diálogo de confirmación para eliminar */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border/10 bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
            <p className="text-muted-foreground mb-4">
              ¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación para guardar cambios */}
      {showSaveConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border/10 bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirmar cambios</h3>
            <p className="text-muted-foreground mb-4">
              ¿Estás seguro de que deseas guardar los cambios realizados en este pedido?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveConfirmation(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSaveChanges}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
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
      className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border/10 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

