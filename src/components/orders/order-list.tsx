"use client"

import { useState, useEffect, useCallback } from "react"
import { Clock, Eye, Filter, Search, X, RefreshCw } from "lucide-react"
import { OrderDetails } from "./order-details"
import { fetchPedidos } from "../../api/api"
import { OrderFilters } from "./order-filters"
import { useStore } from "../../lib/store"

type OrderListProps = {
  searchQuery: string
  filters: {
    status: string
    dateRange: string
    paymentMethod: string
    minAmount: string
    maxAmount: string
  }
}

export function OrderList({ searchQuery, filters }: OrderListProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [refreshKey, setRefreshKey] = useState(0) // Estado para forzar recargas manuales
  const { refreshTrigger } = useStore() // Obtener el trigger de refresco del store global

  // Estados para filtros
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState(filters)

  // Función para cargar pedidos
  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchPedidos()
      console.log("Datos obtenidos de fetchPedidos:", data)

      // Verificar si data es un array
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error("Los datos recibidos no son un array:", data)
        setOrders([])
      }

      setError(null)
    } catch (err) {
      console.error("Error al cargar los pedidos:", err)
      setError("Error al cargar los pedidos. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar pedidos desde la API cuando cambie refreshKey o refreshTrigger
  useEffect(() => {
    loadOrders()
  }, [loadOrders, refreshKey, refreshTrigger])

  // Añadir este efecto para sincronizar los filtros cuando cambien las props
  useEffect(() => {
    setActiveFilters(filters)
  }, [filters])

  // Añadir este efecto para sincronizar la búsqueda cuando cambie la prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Función para refrescar manualmente
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Aplicar filtros
  const getFilteredOrders = () => {
    let result = [...orders]

    // Filtrar por búsqueda
    if (localSearchQuery) {
      result = result.filter(
        (order) => order.nombre && order.nombre.toLowerCase().includes(localSearchQuery.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (activeFilters.status !== "all") {
      // Mapear los valores del filtro a los valores reales en los datos
      const statusMapping: Record<string, string> = {
        pending: "pendiente",
        completed: "completado",
        in_progress: "por deber",
      }

      const statusToFilter = statusMapping[activeFilters.status] || activeFilters.status
      result = result.filter((order) => order.estado === statusToFilter)
    }

    // Filtrar por método de pago
    if (activeFilters.paymentMethod !== "all") {
      result = result.filter((order) => order.metodoPago === activeFilters.paymentMethod)
    }

    // Filtrar por monto
    if (activeFilters.minAmount) {
      result = result.filter((order) => order.total && order.total >= Number(activeFilters.minAmount))
    }

    if (activeFilters.maxAmount) {
      result = result.filter((order) => order.total && order.total <= Number(activeFilters.maxAmount))
    }

    // Filtrar por fecha
    if (activeFilters.dateRange !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (activeFilters.dateRange === "today") {
        result = result.filter((order) => {
          if (!order.fecha) return false
          const orderDate = new Date(order.fecha)
          orderDate.setHours(0, 0, 0, 0)
          return orderDate.getTime() === today.getTime()
        })
      } else if (activeFilters.dateRange === "week") {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)

        result = result.filter((order) => order.fecha && new Date(order.fecha) >= weekAgo)
      } else if (activeFilters.dateRange === "month") {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)

        result = result.filter((order) => order.fecha && new Date(order.fecha) >= monthAgo)
      }
    }

    // Ordenar por fecha (más reciente primero)
    result.sort((a, b) => {
      if (!a.fecha && !b.fecha) return 0
      if (!a.fecha) return 1
      if (!b.fecha) return -1
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    })

    return result
  }

  const filteredOrders = getFilteredOrders()

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Resetear filtros
  const resetFilters = () => {
    setActiveFilters({
      status: "all",
      dateRange: "all",
      paymentMethod: "all",
      minAmount: "",
      maxAmount: "",
    })
    setLocalSearchQuery("")
  }

  // Actualizar página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilters, localSearchQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-lg text-muted-foreground">Cargando pedidos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre de cliente..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/10 bg-secondary/30 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          />
          {localSearchQuery && (
            <button
              onClick={() => setLocalSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 rounded-lg border border-border/10 px-3 py-2 text-sm font-medium ${
              Object.values(activeFilters).some((val) => val !== "all" && val !== "")
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {Object.values(activeFilters).some((val) => val !== "all" && val !== "") && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs text-primary">
                {Object.values(activeFilters).filter((val) => val !== "all" && val !== "").length}
              </span>
            )}
          </button>
          {Object.values(activeFilters).some((val) => val !== "all" && val !== "") && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && <OrderFilters activeFilters={activeFilters} setActiveFilters={setActiveFilters} />}

      {/* Tabla de pedidos */}
      <div className="rounded-lg border border-border/10 bg-card">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Productos</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Fecha/Hora</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/10 last:border-0">
                    <td className="px-4 py-3 text-sm font-medium">{order.nombre || "Sin nombre"}</td>
                    <td className="px-4 py-3 text-sm">
                      {Array.isArray(order.productos) ? order.productos.length : 0} productos
                      <span className="block text-xs text-muted-foreground">
                        {Array.isArray(order.productos) && order.productos.length > 0
                          ? order.productos
                              .map((item: any) => `${item.cantidad}x ${item.producto}`)
                              .join(", ")
                              .substring(0, 30) +
                            (order.productos.map((item: any) => `${item.cantidad}x ${item.producto}`).join(", ")
                              .length > 30
                              ? "..."
                              : "")
                          : "Sin productos"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">${(order.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <OrderStatus status={order.estado || "pendiente"} />
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {order.fecha
                            ? new Date(order.fecha).toLocaleString("es-CO", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Fecha no disponible"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    {orders.length === 0
                      ? "No hay pedidos disponibles"
                      : "No se encontraron pedidos con los filtros seleccionados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/10 px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Mostrando{" "}
              <span className="font-medium">
                {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}
              </span>{" "}
              a <span className="font-medium">{Math.min(filteredOrders.length, currentPage * itemsPerPage)}</span> de{" "}
              <span className="font-medium">{filteredOrders.length}</span> resultados
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-border/10 bg-secondary/30 px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-border/10 bg-secondary/30 px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}

export function OrderStatus({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; color: string }> = {
    pendiente: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-500" },
    completado: { label: "Completado", color: "bg-green-500/20 text-green-500" },
    "por deber": { label: "Por Deber", color: "bg-red-500/20 text-red-500" },
  }

  const statusInfo = statusMap[status] || { label: status, color: "bg-gray-500/20 text-gray-500" }

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  )
}

