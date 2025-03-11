"use client"

import { useState } from "react"
import {
  ArrowRight,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
  AlertTriangle,
  Flame,
  Edit,
  Coffee,
  ShoppingBag,
} from "lucide-react"
import { DashboardCard } from "../components/dashboard/card"
import { OrderForm } from "../components/orders/order-form"
import Link from "next/link"

export default function DashboardPage() {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderType, setOrderType] = useState<"mesa" | "llevar" | null>(null)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)

  // Datos de ejemplo para productos con stock bajo
  const lowStockItems = [
    { id: 3, name: "Whisky Jack Daniel's", stock: 5, category: "licores" },
    { id: 5, name: "Mojito", stock: 0, category: "cocteles" },
    { id: 8, name: "Tequila", stock: 3, category: "licores" },
  ]

  // Datos de ejemplo para productos más vendidos
  const topSellingItems = [
    { id: 1, name: "Cerveza Corona", sold: 48, category: "cervezas" },
    { id: 2, name: "Margarita", sold: 32, category: "cocteles" },
    { id: 7, name: "Piña Colada", sold: 27, category: "cocteles" },
  ]

  // Datos de ejemplo para pedidos activos
  const activeOrders = [
    { id: 1, customerName: "Mesa 1", total: 22.0, items: 3, time: "20:30" },
    { id: 2, customerName: "Mesa 4", total: 40.5, items: 4, time: "21:15" },
    { id: 3, customerName: "Barra 2", total: 35.0, items: 6, time: "21:45" },
  ]

  const handleCreateOrder = (type: "mesa" | "llevar") => {
    setOrderType(type)
    setIsCreatingOrder(true)
    setEditingOrderId(null)
  }

  const handleEditOrder = (orderId: number) => {
    setEditingOrderId(orderId)
    setOrderType(null)
    setIsCreatingOrder(true)
  }

  const handleCloseOrderForm = () => {
    setIsCreatingOrder(false)
    setOrderType(null)
    setEditingOrderId(null)
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">Panel de Control</h1>
          <p className="text-muted-foreground">Gestión rápida del bar</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCreateOrder("mesa")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Coffee className="h-4 w-4" />
            Nuevo Pedido Mesa
          </button>
          <button
            onClick={() => handleCreateOrder("llevar")}
            className="flex items-center gap-2 rounded-lg border border-primary bg-transparent px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            <ShoppingBag className="h-4 w-4" />
            Pedido Para Llevar
          </button>
        </div>
      </div>

      {/* Métricas clave */}
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
          value={lowStockItems.length.toString()}
          description="Productos por reabastecer"
          icon={Package}
          trend="down"
        />
      </div>

      {/* Pedidos Activos */}
      <div className="rounded-xl border border-border/10 bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pedidos Activos</h2>
          <Link href="/orders" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3"
            >
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {order.items} productos • {order.time}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium">${order.total.toFixed(2)}</p>
                <button
                  onClick={() => handleEditOrder(order.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                  title="Agregar productos"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="rounded-xl border border-border/10 bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Acciones Rápidas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/orders?type=mesa"
            className="flex flex-col items-center justify-center rounded-lg border border-border/10 bg-secondary/30 p-4 text-center transition-colors hover:bg-secondary/50"
          >
            <Coffee className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Pedidos en Mesa</span>
          </Link>
          <Link
            href="/orders?type=llevar"
            className="flex flex-col items-center justify-center rounded-lg border border-border/10 bg-secondary/30 p-4 text-center transition-colors hover:bg-secondary/50"
          >
            <ShoppingBag className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Pedidos Para Llevar</span>
          </Link>
          <Link
            href="/inventory"
            className="flex flex-col items-center justify-center rounded-lg border border-border/10 bg-secondary/30 p-4 text-center transition-colors hover:bg-secondary/50"
          >
            <Package className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Gestionar Inventario</span>
          </Link>
          <Link
            href="/inventory?filter=low"
            className="flex flex-col items-center justify-center rounded-lg border border-border/10 bg-secondary/30 p-4 text-center transition-colors hover:bg-secondary/50"
          >
            <AlertTriangle className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Revisar Stock Bajo</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Productos con stock bajo */}
        <div className="rounded-xl border border-border/10 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Stock Bajo</h2>
            <Link href="/inventory?filter=low" className="flex items-center gap-1 text-sm text-primary hover:underline">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.stock === 0
                      ? "bg-red-500/20 text-red-500"
                      : item.stock < 5
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-green-500/20 text-green-500"
                  }`}
                >
                  {item.stock} unidades
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="rounded-xl border border-border/10 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Más Vendidos</h2>
            <Link href="/reports" className="flex items-center gap-1 text-sm text-primary hover:underline">
              Ver reporte <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topSellingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{item.sold} vendidos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transacciones Recientes */}
      <div className="rounded-xl border border-border/10 bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transacciones Recientes</h2>
          <Link href="/orders" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Mesa 8</p>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">Mesa</span>
              </div>
              <p className="text-xs text-muted-foreground">4x Margarita, 2x Mojito</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$49.00</p>
              <p className="text-xs text-muted-foreground">Hace 15 min</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Cliente 12</p>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                  Para llevar
                </span>
              </div>
              <p className="text-xs text-muted-foreground">2x Cerveza Corona</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$10.00</p>
              <p className="text-xs text-muted-foreground">Hace 25 min</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Barra 3</p>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">Mesa</span>
              </div>
              <p className="text-xs text-muted-foreground">2x Whisky Jack Daniel's</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$24.00</p>
              <p className="text-xs text-muted-foreground">Hace 45 min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos Frecuentes */}
      <div className="rounded-xl border border-border/10 bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Pedidos Frecuentes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => handleCreateOrder("mesa")}
            className="flex flex-col justify-between rounded-lg border border-border/10 bg-secondary/30 p-4 text-left transition-colors hover:bg-secondary/50"
          >
            <div>
              <h3 className="font-medium">Happy Hour</h3>
              <p className="text-xs text-muted-foreground">4x Cerveza Corona, 2x Margarita</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium">$37.00</span>
              <Plus className="h-4 w-4 text-primary" />
            </div>
          </button>
          <button
            onClick={() => handleCreateOrder("mesa")}
            className="flex flex-col justify-between rounded-lg border border-border/10 bg-secondary/30 p-4 text-left transition-colors hover:bg-secondary/50"
          >
            <div>
              <h3 className="font-medium">Mesa VIP</h3>
              <p className="text-xs text-muted-foreground">1x Whisky, 1x Vino Tinto, 1x Tabla Quesos</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium">$45.00</span>
              <Plus className="h-4 w-4 text-primary" />
            </div>
          </button>
          <button
            onClick={() => handleCreateOrder("mesa")}
            className="flex flex-col justify-between rounded-lg border border-border/10 bg-secondary/30 p-4 text-left transition-colors hover:bg-secondary/50"
          >
            <div>
              <h3 className="font-medium">Ronda Amigos</h3>
              <p className="text-xs text-muted-foreground">6x Cerveza, 1x Nachos, 1x Papas</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium">$40.00</span>
              <Plus className="h-4 w-4 text-primary" />
            </div>
          </button>
        </div>
      </div>

      {isCreatingOrder && (
        <OrderForm onClose={handleCloseOrderForm} orderType={orderType} editOrderId={editingOrderId} />
      )}
    </div>
  )
}

