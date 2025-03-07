"use client"

import { useState } from "react"
import { Clock, CreditCard, DollarSign, Eye, FileText } from "lucide-react"
import { OrderDetails } from "./order-details"

// Datos de ejemplo - En una aplicación real vendrían de una base de datos
const SAMPLE_ORDERS = [
  {
    id: 1,
    customerName: "Mesa 1",
    items: [
      { productId: 1, name: "Cerveza Corona", quantity: 2, price: 5.0 },
      { productId: 3, name: "Whisky Jack Daniel's", quantity: 1, price: 12.0 },
    ],
    total: 22.0,
    status: "completed",
    createdAt: new Date(2024, 2, 6, 20, 30),
    paymentMethod: "cash",
    note: "Sin hielo en el whisky",
  },
  {
    id: 2,
    customerName: "Mesa 4",
    items: [
      { productId: 2, name: "Margarita", quantity: 3, price: 8.5 },
      { productId: 4, name: "Vino Tinto", quantity: 1, price: 15.0 },
    ],
    total: 40.5,
    status: "in_progress",
    createdAt: new Date(2024, 2, 6, 21, 15),
    paymentMethod: "card",
    note: "",
  },
  {
    id: 3,
    customerName: "Barra 2",
    items: [
      { productId: 1, name: "Cerveza Corona", quantity: 4, price: 5.0 },
      { productId: 5, name: "Mojito", quantity: 2, price: 7.5 },
    ],
    total: 35.0,
    status: "pending",
    createdAt: new Date(2024, 2, 6, 21, 45),
    paymentMethod: "cash",
    note: "Mojitos sin menta",
  },
  {
    id: 4,
    customerName: "Mesa 7",
    items: [
      { productId: 3, name: "Whisky Jack Daniel's", quantity: 2, price: 12.0 },
      { productId: 2, name: "Margarita", quantity: 2, price: 8.5 },
      { productId: 6, name: "Nachos con Queso", quantity: 1, price: 8.0 },
    ],
    total: 49.0,
    status: "pending",
    createdAt: new Date(2024, 2, 6, 22, 0),
    paymentMethod: "card",
    note: "Cliente frecuente",
  },
  {
    id: 5,
    customerName: "Mesa 3",
    items: [
      { productId: 4, name: "Vino Tinto", quantity: 1, price: 15.0 },
      { productId: 7, name: "Tabla de Quesos", quantity: 1, price: 18.0 },
    ],
    total: 33.0,
    status: "completed",
    createdAt: new Date(2024, 2, 6, 19, 30),
    paymentMethod: "cash",
    note: "",
  },
  {
    id: 6,
    customerName: "Mesa 5",
    items: [
      { productId: 2, name: "Margarita", quantity: 4, price: 8.5 },
      { productId: 8, name: "Alitas BBQ", quantity: 2, price: 10.0 },
    ],
    total: 54.0,
    status: "in_progress",
    createdAt: new Date(2024, 2, 6, 20, 45),
    paymentMethod: "card",
    note: "Alitas extra picantes",
  },
  {
    id: 7,
    customerName: "Barra 1",
    items: [
      { productId: 3, name: "Whisky Jack Daniel's", quantity: 1, price: 12.0 },
      { productId: 9, name: "Papas Fritas", quantity: 1, price: 5.0 },
    ],
    total: 17.0,
    status: "completed",
    createdAt: new Date(2024, 2, 6, 19, 0),
    paymentMethod: "cash",
    note: "Cliente habitual",
  },
  {
    id: 8,
    customerName: "Mesa 8",
    items: [
      { productId: 10, name: "Gin Tonic", quantity: 2, price: 10.0 },
      { productId: 11, name: "Ensalada César", quantity: 1, price: 12.0 },
    ],
    total: 32.0,
    status: "pending",
    createdAt: new Date(2024, 2, 6, 21, 30),
    paymentMethod: "card",
    note: "Sin anchoas en la ensalada",
  },
  {
    id: 9,
    customerName: "Mesa 2",
    items: [
      { productId: 12, name: "Cerveza Heineken", quantity: 6, price: 5.5 },
      { productId: 13, name: "Nachos con Guacamole", quantity: 2, price: 9.0 },
    ],
    total: 51.0,
    status: "in_progress",
    createdAt: new Date(2024, 2, 6, 22, 15),
    paymentMethod: "cash",
    note: "Extra guacamole",
  },
  {
    id: 10,
    customerName: "Barra 3",
    items: [
      { productId: 14, name: "Cuba Libre", quantity: 3, price: 8.0 },
      { productId: 15, name: "Tequeños", quantity: 2, price: 7.0 },
    ],
    total: 38.0,
    status: "completed",
    createdAt: new Date(2024, 2, 6, 20, 0),
    paymentMethod: "card",
    note: "",
  },
  {
    id: 11,
    customerName: "Mesa 6",
    items: [
      { productId: 16, name: "Piña Colada", quantity: 2, price: 9.0 },
      { productId: 17, name: "Camarones al Ajillo", quantity: 1, price: 15.0 },
    ],
    total: 33.0,
    status: "pending",
    createdAt: new Date(2024, 2, 6, 21, 0),
    paymentMethod: "card",
    note: "Sin coco en las piñas coladas",
  },
  {
    id: 12,
    customerName: "Mesa 9",
    items: [
      { productId: 18, name: "Sangría", quantity: 1, price: 20.0 },
      { productId: 19, name: "Tabla Mixta", quantity: 1, price: 25.0 },
    ],
    total: 45.0,
    status: "in_progress",
    createdAt: new Date(2024, 2, 6, 20, 15),
    paymentMethod: "cash",
    note: "Para compartir",
  },
  {
    id: 13,
    customerName: "Barra 4",
    items: [
      { productId: 20, name: "Shot Tequila", quantity: 4, price: 5.0 },
      { productId: 21, name: "Limón y Sal", quantity: 1, price: 1.0 },
    ],
    total: 21.0,
    status: "completed",
    createdAt: new Date(2024, 2, 6, 22, 30),
    paymentMethod: "cash",
    note: "",
  },
  {
    id: 14,
    customerName: "Mesa 10",
    items: [
      { productId: 22, name: "Botella Vino Tinto", quantity: 1, price: 45.0 },
      { productId: 23, name: "Queso Manchego", quantity: 1, price: 12.0 },
    ],
    total: 57.0,
    status: "pending",
    createdAt: new Date(2024, 2, 6, 21, 45),
    paymentMethod: "card",
    note: "Vino a temperatura ambiente",
  },
  {
    id: 15,
    customerName: "Mesa 11",
    items: [
      { productId: 24, name: "Cerveza Artesanal", quantity: 3, price: 7.0 },
      { productId: 25, name: "Hamburguesa", quantity: 2, price: 12.0 },
    ],
    total: 45.0,
    status: "in_progress",
    createdAt: new Date(2024, 2, 6, 20, 45),
    paymentMethod: "card",
    note: "Hamburguesas término medio",
  },
]

export function OrderList({
  searchQuery,
  filters,
}: {
  searchQuery: string
  filters: {
    status: string
    dateRange: string
    paymentMethod: string
    minAmount: string
    maxAmount: string
  }
}) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filtrar por búsqueda
  let filteredOrders = SAMPLE_ORDERS.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filtrar por estado
  if (filters.status !== "all") {
    filteredOrders = filteredOrders.filter((order) => order.status === filters.status)
  }

  // Filtrar por método de pago
  if (filters.paymentMethod !== "all") {
    filteredOrders = filteredOrders.filter((order) => order.paymentMethod === filters.paymentMethod)
  }

  // Filtrar por monto
  if (filters.minAmount) {
    filteredOrders = filteredOrders.filter((order) => order.total >= Number(filters.minAmount))
  }
  if (filters.maxAmount) {
    filteredOrders = filteredOrders.filter((order) => order.total <= Number(filters.maxAmount))
  }

  // Filtrar por fecha
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (filters.dateRange === "today") {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })
  } else if (filters.dateRange === "week") {
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    filteredOrders = filteredOrders.filter((order) => order.createdAt >= weekAgo)
  } else if (filters.dateRange === "month") {
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    filteredOrders = filteredOrders.filter((order) => order.createdAt >= monthAgo)
  }

  // Ordenar
  filteredOrders.sort((a, b) => {
    if (sortField === "createdAt") {
      return sortDirection === "desc"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime()
    } else if (sortField === "total") {
      return sortDirection === "desc" ? b.total - a.total : a.total - b.total
    }
    return 0
  })

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <div className="rounded-lg border border-border/10 bg-card">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Productos</th>
                <th
                  className="px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center justify-end">
                    Total
                    {sortField === "total" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Pago</th>
                <th
                  className="px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center justify-end">
                    Hora
                    {sortField === "createdAt" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/10 last:border-0">
                  <td className="px-4 py-3 text-sm font-medium">
                    {order.customerName}
                    {order.note && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-secondary/30 px-2 py-0.5 text-xs text-muted-foreground">
                        <FileText className="mr-1 h-3 w-3" />
                        Nota
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.items.length} productos
                    <span className="block text-xs text-muted-foreground">
                      {order.items
                        .map((item) => `${item.quantity}x ${item.name}`)
                        .join(", ")
                        .substring(0, 30)}
                      {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ").length > 30 ? "..." : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.paymentMethod === "cash" ? (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                        <DollarSign className="mr-1 h-3 w-3" />
                        Efectivo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
                        <CreditCard className="mr-1 h-3 w-3" />
                        Tarjeta
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{order.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
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
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron pedidos con los filtros seleccionados
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
    </>
  )
}

export function OrderStatus({ status }: { status: string }) {
  const statusMap = {
    pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-500" },
    in_progress: { label: "En Preparación", color: "bg-blue-500/20 text-blue-500" },
    completed: { label: "Completado", color: "bg-green-500/20 text-green-500" },
  }

  const { label, color } = statusMap[status as keyof typeof statusMap]

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${color}`}>{label}</span>
}

