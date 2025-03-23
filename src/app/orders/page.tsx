"use client"

import { useState } from "react"
import { Bell, ChevronDown, ChevronUp, Filter, Plus, Search, TrendingUp, ShoppingBag } from 'lucide-react'
import { OrderList } from "../../components/orders/order-list"
import { OrderForm } from "../../components/orders/order-form"
import { OrderFilters } from "../../components/orders/order-filters"
import { OrderStats } from "../../components/orders/order-stats"
// import { OrderNotifications } from "../../components/orders/order-notifications"
import { ActiveOrders } from "../../components/orders/active-orders"

export default function OrdersPage() {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderType, setOrderType] = useState<"mesa" | "llevar" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showActiveOrders, setShowActiveOrders] = useState(true)
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    dateRange: "all",
    paymentMethod: "all",
    minAmount: "",
    maxAmount: "",
  })

//   // Simulación de notificaciones
//   const notifications = [
//     { id: 1, message: "Nuevo pedido de Mesa 8", time: "Hace 5 minutos", read: false },
//     { id: 2, message: "Pedido #12 listo para entregar", time: "Hace 10 minutos", read: false },
//     { id: 3, message: "Stock bajo de Cerveza Corona", time: "Hace 30 minutos", read: true },
//   ]

  const handleCreateOrder = (type: "mesa" | "llevar") => {
    setOrderType(type)
    setIsCreatingOrder(true)
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">Pedidos</h1>
          <p className="text-muted-foreground">Gestiona los pedidos de tus clientes</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg border border-border/10 bg-secondary/30 p-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button> */}

          <button
            onClick={() => setShowStats(!showStats)}
            className={`flex items-center gap-2 rounded-lg border border-border/10 px-3 py-2 text-sm font-medium transition-colors ${
              showStats ? "bg-accent text-primary" : "bg-secondary/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Estadísticas</span>
          </button>

          <button
            onClick={() => handleCreateOrder("mesa")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
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

      {showStats && <OrderStats />}

      {showFilters && <OrderFilters activeFilters={activeFilters} setActiveFilters={setActiveFilters} />}

      <OrderList searchQuery={searchQuery} filters={activeFilters} />

      <div className="mt-4 rounded-lg border border-border/10 bg-card overflow-hidden">
        <button
          onClick={() => setShowActiveOrders(!showActiveOrders)}
          className="flex w-full items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pedidos en Curso</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">3 activos</span>
          </div>
          {showActiveOrders ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {showActiveOrders && (
          <div className="p-4 pt-0 border-t border-border/10">
            <ActiveOrders />
          </div>
        )}
      </div>

      {isCreatingOrder && <OrderForm onClose={() => {
        setIsCreatingOrder(false)
        setOrderType(null)
      }} orderType={orderType} />}
    </div>
  )
}