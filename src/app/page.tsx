"use client"

import { useState } from "react"
import { DollarSign, Package, Plus, ShoppingCart } from "lucide-react"
import { DashboardCard } from "../components/dashboard/card"
import { RecentOrders } from "../components/dashboard/recent-orders"
import { OrderForm } from "../components/orders/order-form"

export default function DashboardPage() {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido al panel de administración</p>
        </div>

        <button
          onClick={() => setIsCreatingOrder(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo Pedido
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard
          title="Ventas del Día"
          value="$2,543.80"
          description="+15% vs. ayer"
          icon={DollarSign}
          trend="up"
        />
        <DashboardCard
          title="Pedidos Activos"
          value="12"
          description="4 pendientes"
          icon={ShoppingCart}
          trend="neutral"
        />
        <DashboardCard
          title="Stock Bajo"
          value="8"
          description="Productos por reabastecer"
          icon={Package}
          trend="down"
        />
      </div>

      <RecentOrders />

      {isCreatingOrder && <OrderForm onClose={() => setIsCreatingOrder(false)} />}
    </div>
  )
}

