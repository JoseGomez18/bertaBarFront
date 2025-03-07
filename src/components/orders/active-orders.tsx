"use client"

import { useState } from "react"
import { AlarmClock, ArrowRight, Clock, Coffee, Utensils } from "lucide-react"
import { OrderDetails } from "./order-details"

// Datos de ejemplo - En una aplicación real vendrían de una base de datos
const ACTIVE_ORDERS = [
  {
    id: 2,
    customerName: "Mesa 4",
    items: [
      { productId: 2, name: "Margarita", quantity: 3, price: 8.5 },
      { productId: 4, name: "Vino Tinto", quantity: 1, price: 15.0 },
    ],
    total: 40.5,
    status: "in_progress",
    createdAt: new Date(2023, 5, 15, 21, 15),
    paymentMethod: "card",
    note: "",
    timeElapsed: 12, // minutos desde que se creó el pedido
    estimatedTime: 15, // tiempo estimado total en minutos
  },
  {
    id: 3,
    customerName: "Barra 2",
    items: [{ productId: 1, name: "Cerveza Corona", quantity: 4, price: 5.0 }],
    total: 20.0,
    status: "pending",
    createdAt: new Date(2023, 5, 15, 21, 45),
    paymentMethod: "cash",
    note: "",
    timeElapsed: 5,
    estimatedTime: 10,
  },
  {
    id: 4,
    customerName: "Mesa 7",
    items: [
      { productId: 3, name: "Whisky Jack Daniel's", quantity: 2, price: 12.0 },
      { productId: 2, name: "Margarita", quantity: 2, price: 8.5 },
    ],
    total: 41.0,
    status: "pending",
    createdAt: new Date(2023, 5, 15, 22, 0),
    paymentMethod: "card",
    note: "Cliente frecuente",
    timeElapsed: 3,
    estimatedTime: 15,
  },
]

export function ActiveOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ACTIVE_ORDERS.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-border/10 bg-card/50 p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{order.customerName}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{order.createdAt.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
                </div>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  order.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                }`}
              >
                {order.status === "pending" ? "Pendiente" : "En Preparación"}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Productos:</div>
              <ul className="space-y-1">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-1 text-sm">
                    <Coffee className="h-3 w-3 text-primary" />
                    {item.quantity}x {item.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">
                <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <AlarmClock className="h-3 w-3 text-muted-foreground" />
                <span
                  className={`${
                    order.timeElapsed > order.estimatedTime
                      ? "text-red-500"
                      : order.timeElapsed > order.estimatedTime * 0.8
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {order.timeElapsed} min
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{order.estimatedTime} min</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/10">
              <div className="flex items-center gap-1">
                <Utensils className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Ver detalles
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {ACTIVE_ORDERS.length === 0 && (
        <div className="rounded-lg border border-border/10 bg-card/50 p-6 text-center">
          <p className="text-muted-foreground">No hay pedidos en curso actualmente</p>
        </div>
      )}

      {selectedOrder && <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  )
}

