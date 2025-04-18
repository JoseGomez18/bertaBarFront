"use client"

import { useStore } from "../../lib/store"

export function RecentOrders() {
  const { orders, updateOrderStatus } = useStore()

  // Ordenar por fecha más reciente
  const sortedOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="rounded-xl border border-border/10 bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Pedidos Recientes</h3>
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-4"
          >
            <div>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">
                {order.items.length} productos • ${order.total.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                className="rounded-lg border border-border/10 bg-secondary/30 px-2 py-1 text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Preparación</option>
                <option value="completed">Completado</option>
              </select>
              <OrderStatus status={order.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderStatus({ status }: { status: string }) {
  const statusMap = {
    pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-500" },
    in_progress: { label: "En Preparación", color: "bg-blue-500/20 text-blue-500" },
    completed: { label: "Completado", color: "bg-green-500/20 text-green-500" },
  }

  const { label, color } = statusMap[status as keyof typeof statusMap]

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{label}</span>
}

