"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FileText, Minus, Plus, Search, Star, X, Coffee, ShoppingBag } from 'lucide-react'
import { fetchProducts, fetchCategories } from "../../api/api"
import type { Product, Category, OrderItem, Order } from "../../types/inventario"

// Mantenemos los pedidos frecuentes por ahora, pero podrías considerar moverlos a la base de datos en el futuro
const FREQUENT_ORDERS = [
  {
    name: "Happy Hour",
    items: [
      { productId: 59, name: "TRES CORDILLERAS ROSADA", quantity: 4, price: 7500 },
      { productId: 58, name: "cheetos", quantity: 2, price: 20 },
    ],
  },
  {
    name: "Combo Salud",
    items: [
      { productId: 46, name: "acetaminofen", quantity: 1, price: 20 },
      { productId: 58, name: "cheetos", quantity: 1, price: 20 },
    ],
  },
]

type OrderFormProps = {
  onClose: () => void
  orderType?: "mesa" | "llevar" | null
  editOrderId?: number | null
}

export function OrderForm({ onClose, orderType = null, editOrderId = null }: OrderFormProps) {
  const [customerName, setCustomerName] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [note, setNote] = useState("")
  const [showFrequentOrders, setShowFrequentOrders] = useState(false)
  const [formType, setFormType] = useState<"mesa" | "llevar" | "editar">(
    editOrderId ? "editar" : orderType === "llevar" ? "llevar" : "mesa",
  )
  const [orderStatus, setOrderStatus] = useState<"pending" | "in_progress" | "completed">("pending")
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash")
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [showServiceChargeDialog, setShowServiceChargeDialog] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([fetchProducts(), fetchCategories()])
        setProducts(productsData)
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Error al cargar los datos. Por favor, intente de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const updateOrderStatus = (status: "pending" | "in_progress" | "completed") => {
    setOrderStatus(status)
  }

  const addItem = (product: Product) => {
    const existingItem = items.find((item) => item.productId === product.id)
    if (existingItem) {
      setItems(items.map((item) => (item.productId === product.id ? { ...item, quantity: item.cantidad + 1 } : item)))
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          producto: product.nombre,
          cantidad: product.cantidad,
          price: product.precio_venta,
          category: product.categoria,
          serviceCharge: 0,
        },
      ])
    }
  }

  const updateQuantity = (productId: number, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.productId === productId) {
          const newQuantity = item.cantidad + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }),
    )
  }

  const removeItem = (productId: number) => {
    setItems(items.filter((item) => item.productId !== productId))
  }

  // const loadFrequentOrder = (frequentOrder: (typeof FREQUENT_ORDERS)[0]) => {
  //   setItems(
  //     frequentOrder.items.map((item) => ({
  //       ...item,
  //       serviceCharge: 0,
  //       category: products.find((p) => p.id === item.productId)?.categoria,
  //     })),
  //   )
  //   setShowFrequentOrders(false)
  // }

  const handleServiceCharge = (productId: number) => {
    setSelectedProductId(productId)
    setShowServiceChargeDialog(true)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const itemSubtotal = item.price * item.cantidad
      const serviceCharge = item.serviceCharge || 0
      return sum + itemSubtotal + serviceCharge
    }, 0)
  }

  const total = calculateTotal()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      id: editOrderId,
      customerName,
      items,
      total,
      status: "pending",
      createdAt: new Date(),
      note,
      type: formType,
    })
    onClose()
  }

  const getFormTitle = () => {
    if (editOrderId) {
      return "Agregar a Pedido Existente"
    }
    return formType === "llevar" ? "Pedido Para Llevar" : "Nuevo Pedido en Mesa"
  }

  const uniqueCategories = ["all", ...Array.from(new Set(categories.map((c) => c.nombre)))]

  const filteredProducts: Product[] = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.cantidad > 0 &&
      (activeCategory === "all" || String(product.categoria) === activeCategory),
  )

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-lg border border-border/10 bg-card p-4 shadow-lg my-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{getFormTitle()}</h2>
            {!editOrderId && (
              <div className="flex rounded-lg border border-border/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormType("mesa")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs ${formType === "mesa" ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  <Coffee className="h-3 w-3" />
                  Mesa
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("llevar")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs ${formType === "llevar"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  <ShoppingBag className="h-3 w-3" />
                  Para Llevar
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {formType === "llevar" ? "Nombre del Cliente" : "Mesa / Ubicación"}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                required
                disabled={editOrderId !== null}
                placeholder={formType === "llevar" ? "Nombre del cliente" : "Ej: Mesa 1, Barra 2"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Pedidos Frecuentes</label>
              <button
                type="button"
                onClick={() => setShowFrequentOrders(!showFrequentOrders)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              >
                <Star className="h-4 w-4" />
                Cargar Pedido Frecuente
              </button>
              {showFrequentOrders && (
                <div className="absolute mt-1 w-64 rounded-lg border border-border/10 bg-card p-2 shadow-lg">
                  {FREQUENT_ORDERS.map((order, index) => (
                    <button
                      key={index}
                      type="button"
                      // onClick={() => loadFrequentOrder(order)}
                      className="flex w-full items-start justify-between rounded-lg p-2 text-left text-sm hover:bg-secondary/30"
                    >
                      <div>
                        <p className="font-medium">{order.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} productos • $
                          {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                        </p>
                      </div>
                      <Star className="h-4 w-4 text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 pl-10 pr-3 py-2 text-foreground"
                />
              </div>

              <div className="mb-2 flex flex-wrap gap-2">
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                  >
                    {category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addItem(product)}
                    className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3 text-sm hover:bg-secondary/50"
                  >
                    <div className="flex items-center">
                      <span>{product.nombre}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({product.cantidad} disponibles)</span>
                    </div>
                    <span className="text-primary">${product.precio_venta.toFixed(2)}</span>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="rounded-lg border border-border/10 bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                    No se encontraron productos
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Productos Seleccionados</h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col rounded-lg border border-border/10 bg-secondary/30 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">{item.producto}</span>
                        <span className="ml-2 text-xs text-primary">${item.price.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-sm">{item.cantidad}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="rounded-lg p-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 border-t border-border/10 pt-2">
                      <button
                        type="button"
                        onClick={() => handleServiceCharge(item.productId)}
                        className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors ${(item.serviceCharge || 0) > 0
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/10 bg-secondary/20 text-muted-foreground hover:bg-secondary/30"
                          }`}
                      >
                        <Plus className="h-3 w-3" />
                        {(item.serviceCharge || 0) > 0
                          ? `Servicio: $${item.serviceCharge?.toFixed(2)}`
                          : "Agregar servicio"}
                      </button>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="rounded-lg border border-border/10 bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                    No hay productos seleccionados
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t border-border/10 pt-4">
                    <span className="font-medium">Total</span>
                    <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Notas del pedido
                  </div>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Instrucciones especiales, preferencias, etc."
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => updateOrderStatus("pending")}
                  className={`rounded-lg px-3 py-1 text-sm ${orderStatus === "pending"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  Pendiente
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus("in_progress")}
                  className={`rounded-lg px-3 py-1 text-sm ${orderStatus === "in_progress"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  En Preparación
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus("completed")}
                  className={`rounded-lg px-3 py-1 text-sm ${orderStatus === "completed"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  Completado
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={items.length === 0 || !customerName}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {editOrderId ? "Actualizar Pedido" : "Crear Pedido"}
            </button>
          </div>
        </form>
        {showServiceChargeDialog && selectedProductId && (
          <ServiceChargeDialog
            isOpen={showServiceChargeDialog}
            onClose={() => {
              setShowServiceChargeDialog(false)
              setSelectedProductId(null)
            }}
            onConfirm={(amount) => {
              setItems(
                items.map((item) => (item.productId === selectedProductId ? { ...item, serviceCharge: amount } : item)),
              )
              setShowServiceChargeDialog(false)
              setSelectedProductId(null)
            }}
            initialValue={items.find((item) => item.productId === selectedProductId)?.serviceCharge || 0}
          />
        )}
      </div>
    </div>
  )
}

// ServiceChargeDialog Component
function ServiceChargeDialog({
  isOpen,
  onClose,
  onConfirm,
  initialValue,
}: { isOpen: boolean; onClose: () => void; onConfirm: (amount: number) => void; initialValue: number }) {
  const [amount, setAmount] = useState(initialValue)

  useEffect(() => {
    setAmount(initialValue)
  }, [initialValue])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-border/10 bg-card p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Agregar Cargo de Servicio</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">Monto del Servicio</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(amount)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}