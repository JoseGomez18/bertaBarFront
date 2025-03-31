"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Clock, CreditCard, DollarSign, Edit, FileText, Printer, Split, Trash, X, Receipt, Plus, Minus, ArrowRightLeft } from 'lucide-react'
import { OrderStatus } from "./order-list"
import { actualizarEstadoVenta } from "../../api/api"
import { useStore } from "../../lib/store"

type OrderDetailsProps = {
  order: any
  onClose: () => void
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const [status, setStatus] = useState(order.estado)
  const [isEditing, setIsEditing] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [note, setNote] = useState(order.note || "")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">(order.paymentMethod || "cash")
  const [showSplitBill, setShowSplitBill] = useState(false)
  const [splitCount, setSplitCount] = useState(2)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [change, setChange] = useState(0)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Estado para los cargos de servicio por ítem
  const [itemServiceCharges, setItemServiceCharges] = useState<Record<number, number>>({})

  // Añadir estos estados después de los otros estados
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)

  // Inicializar los cargos de servicio por producto desde el pedido
  useEffect(() => {
    if (order && order.productos) {
      const charges: Record<number, number> = {};
      order.productos.forEach((item: any) => {
        if (item.productId && item.servicio_producto) {
          charges[item.productId] = parseFloat(item.servicio_producto);
        }
      });
      setItemServiceCharges(charges);
    }
  }, [order]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await actualizarEstadoVenta(order.id, newStatus as "pendiente" | "completado" | "por deber");
      setStatus(newStatus);
      // Actualizar la lista de pedidos
      useStore.getState().fetchPedidos();
      useStore.getState().triggerRefresh();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
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
    if (paymentMethod === "cash" && paymentAmount < order.total) {
      alert("El monto recibido es menor al total")
      return
    }

    // Process payment...
    console.log("Procesando pago:", {
      orderId: order.id,
      method: paymentMethod,
      total: order.total,
      paymentAmount: paymentMethod === "cash" ? paymentAmount : order.total,
      change: paymentMethod === "cash" ? change : 0,
    })

    // Mark order as completed
    handleStatusChange("completado");
    setOrderCompleted(true)
  }

  // Calcular el total de servicios por producto
  const totalServiciosPorProducto = order.productos?.reduce(
    (sum: number, item: any) => sum + parseFloat(item.servicio_producto || 0),
    0
  ) || 0;

  // Calcular el subtotal de productos (sin servicios)
  const subtotalProductos = parseFloat(order.subtotal_productos || order.subtotal_sin_servicio_general || 0);

  // Servicio general (como cargo adicional independiente)
  const servicioGeneral = parseFloat(order.servicio_general || 0);

  // Total (suma de subtotal + servicios por producto + servicio general)
  const total = subtotalProductos + totalServiciosPorProducto + servicioGeneral;

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
              El pedido para {order.nombre} ha sido procesado correctamente.
            </p>

            <div className="w-full rounded-lg border border-border/10 bg-secondary/20 p-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal Productos:</span>
                <span>${subtotalProductos.toFixed(2)}</span>
              </div>

              {totalServiciosPorProducto > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Servicios por Producto:</span>
                  <span>${totalServiciosPorProducto.toFixed(2)}</span>
                </div>
              )}

              {servicioGeneral > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Servicio General Adicional:</span>
                  <span>${servicioGeneral.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mb-4 font-bold border-t border-border/10 pt-2">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
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
              {isProcessingPayment ? `Procesar Pago - ${order.nombre}` : `Detalles del Pedido #${order.id}`}
            </h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>{order.fecha ? new Date(order.fecha).toLocaleString() : "Fecha no disponible"}</span>
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
                  className={`rounded-lg p-2 ${isEditing
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
                  <h3 className="font-medium">{order.nombre}</h3>
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
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Servicio</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.productos.map((item: any) => (
                      <tr key={item.productId} className="border-t border-border/10">
                        <td className="px-4 py-2 text-sm">
                          <div className="flex flex-col">
                            <span>{item.producto}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center text-sm">{item.cantidad}</td>
                        <td className="px-4 py-2 text-right text-sm">${parseFloat(item.precio).toFixed(2)}</td>
                        <td className="px-4 py-2 text-right text-sm">${parseFloat(item.servicio_producto || 0).toFixed(2)}</td>
                        <td className="px-4 py-2 text-right text-sm font-medium">
                          ${(item.cantidad * parseFloat(item.precio)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-secondary/20">
                    <tr className="border-t border-border/10">
                      <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium">
                        Subtotal Productos
                      </td>
                      <td className="px-4 py-2 text-right text-sm font-medium">
                        ${subtotalProductos.toFixed(2)}
                      </td>
                    </tr>
                    {totalServiciosPorProducto > 0 && (
                      <tr className="border-t border-border/10">
                        <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium">
                          Servicios por Producto
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-medium">${totalServiciosPorProducto.toFixed(2)}</td>
                      </tr>
                    )}
                    {servicioGeneral > 0 && (
                      <tr className="border-t border-border/10">
                        <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium">
                          Servicio General Adicional
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-medium">${servicioGeneral.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="border-t border-border/10 font-medium">
                      <td colSpan={4} className="px-4 py-2 text-right">
                        Total
                      </td>
                      <td className="px-4 py-2 text-right text-primary font-bold">${total.toFixed(2)}</td>
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
                    className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${showSplitBill
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
                    <span className="text-primary">${(total / splitCount).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Order Status */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Estado del Pedido</h3>
                <div className="flex gap-2">
                  <StatusButton
                    status="pendiente"
                    currentStatus={status}
                    onClick={() => handleStatusChange("pendiente")}
                    disabled={isUpdatingStatus}
                  >
                    Pendiente
                  </StatusButton>
                  <StatusButton
                    status="por deber"
                    currentStatus={status}
                    onClick={() => handleStatusChange("por deber")}
                    disabled={isUpdatingStatus}
                  >
                    Por Deber
                  </StatusButton>
                  <StatusButton
                    status="completado"
                    currentStatus={status}
                    onClick={() => handleStatusChange("completado")}
                    disabled={isUpdatingStatus}
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
                  <span className="text-sm text-muted-foreground">Subtotal Productos:</span>
                  <span>${subtotalProductos.toFixed(2)}</span>
                </div>

                {totalServiciosPorProducto > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Servicios por Producto:</span>
                    <span>${totalServiciosPorProducto.toFixed(2)}</span>
                  </div>
                )}

                {servicioGeneral > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Servicio General Adicional:</span>
                    <span>${servicioGeneral.toFixed(2)}</span>
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
                      <span className="text-primary">${(total / splitCount).toFixed(2)}</span>
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
          ) : isProcessingPayment ? (
            <>
              <button
                onClick={() => setIsProcessingPayment(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                disabled={paymentMethod === "cash" && paymentAmount < total}
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
              >
                Completar Pago
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
  disabled = false,
}: {
  children: React.ReactNode
  status: string
  currentStatus: string
  onClick: () => void
  disabled?: boolean
}) {
  const statusColors = {
    pendiente: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    "por deber": "bg-blue-500/20 text-blue-500 border-blue-500/50",
    completado: "bg-green-500/20 text-green-500 border-green-500/50",
  }

  const isActive = status === currentStatus

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${statusColors[status as keyof typeof statusColors]
        } ${isActive ? "ring-2 ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
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
      className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${selected
        ? "border-primary bg-primary/10 text-primary"
        : "border-border/10 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        }`}
    >
      {icon}
      {label}
    </button>
  )
}