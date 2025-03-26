"use client"

import { AlarmClock, ArrowRight, Clock, Coffee, Utensils, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { OrderDetails } from "./order-details"
import { OrderForm } from "./order-form"
import axios from "axios"
import { useEffect, useState } from "react"
import { useStore } from "../../lib/store"
import { Order } from "@/src/types/inventario"

export function ActiveOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
  const { orders, deletePedidos, fetchPedidos } = useStore()
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      await fetchPedidos()
    }
    fetchData()
  }, [fetchPedidos]);

  useEffect(() => {
    console.log("Estado de pedidos actualizado:", orders);
  }, [orders]);

  // Inicializar todos los pedidos como no expandidos
  useEffect(() => {
    const expanded: Record<number, boolean> = {};
    orders.forEach((order) => {
      expanded[order.id] = false;
    });
    setExpandedOrders(expanded);
  }, [orders]);

  const handleAddToOrder = (orderId: number) => {
    setEditingOrderId(orderId)
  }

  const handleCloseOrderForm = () => {
    setEditingOrderId(null)
  }
  const toggleOrderExpanded = (orderId: number) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {orders.filter((order) => order.estado === "pendiente").map((order) => (
          <div
            key={order.id}
            className={`relative rounded-lg border-2 ${order.estado === "pendiente"
              ? "border-yellow-500/50"
              : order.estado === "completado"
                ? "border-blue-500/50"
                : "border-green-500/50"
              } bg-gradient-to-br from-card/50 to-card/30 transition-all hover:shadow-md overflow-hidden`}
          >
            {/* Cabecera del pedido (siempre visible) */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleOrderExpanded(order.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <h3 className="font-medium">{order.nombre}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{order.fecha ? order.fecha.toString() : "Fecha no disponible"}</span>
                  </div>
                </div>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${order.estado === "pendiente"
                    ? "bg-yellow-500/30 text-yellow-500 border border-yellow-500/20"
                    : "bg-blue-500/30 text-blue-500 border border-blue-500/20"
                    }`}
                >
                  {order.estado === "pendiente" ? "Pendiente" : "completado"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">${order.total}</span>
                {/* <span className="font-medium">$2000</span> */}
                {expandedOrders[order.id] ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Contenido expandible */}
            {expandedOrders[order.id] && (
              <>
                <div className="px-4 pb-3">
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Productos:</div>
                    <ul className="space-y-1">
                      {order.productos.map((item, index) => (
                        <li key={index} className="flex items-center gap-1 text-sm">
                          <Coffee className="h-3 w-3 text-primary" />
                          {item.cantidad}x {item.producto}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Utensils className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">
                        {order.productos.reduce((sum, item) => sum + item.cantidad, 0)} items
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 border-t border-border/10 bg-gradient-to-r from-transparent via-border/5 to-transparent">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-green-500/50 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-500 hover:bg-green-500/20"
                    >
                      Pagar
                    </button>
                    <button
                      onClick={() => handleAddToOrder(order.id)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      <Plus className="h-3 w-3" />
                      Agregar
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground col-span-2"
                    >
                      Ver detalles
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="rounded-lg border border-border/10 bg-card/50 p-6 text-center">
          <p className="text-muted-foreground">No hay pedidos en curso actualmente</p>
        </div>
      )}

      {selectedOrder && <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {editingOrderId !== null && (
        <div key={editingOrderId}>
          <OrderForm onClose={handleCloseOrderForm} editOrderId={editingOrderId} />
        </div>
      )}    </>
  )
}

const ServiceChargeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  initialValue = 0,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number) => void
  initialValue?: number
}) => {
  const [amount, setAmount] = useState(initialValue.toString())

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-border/10 bg-card p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Cargo por Servicio</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Monto del servicio</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-border/10 bg-secondary/20 pl-7 pr-3 py-2 text-right"
                min="0"
                step="0.01"
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm(Number.parseFloat(amount) || 0)
                onClose()
              }}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

