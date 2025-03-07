"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Minus, Plus, Search, Star, X } from "lucide-react"

// Datos de ejemplo - En una aplicación real vendrían del inventario
const SAMPLE_PRODUCTS = [
  { id: 1, name: "Cerveza Corona", category: "cervezas", price: 5.0, stock: 48, popular: true },
  { id: 2, name: "Margarita", category: "cocteles", price: 8.5, stock: 15, popular: true },
  { id: 3, name: "Whisky Jack Daniel's", category: "licores", price: 12.0, stock: 5, popular: false },
  { id: 4, name: "Vino Tinto", category: "vinos", price: 15.0, stock: 12, popular: false },
  { id: 5, name: "Mojito", category: "cocteles", price: 7.5, stock: 20, popular: true },
  { id: 6, name: "Cerveza Heineken", category: "cervezas", price: 5.5, stock: 36, popular: false },
  { id: 7, name: "Piña Colada", category: "cocteles", price: 9.0, stock: 18, popular: true },
  { id: 8, name: "Tequila", category: "licores", price: 10.0, stock: 8, popular: false },
]

// Pedidos frecuentes predefinidos
const FREQUENT_ORDERS = [
  {
    name: "Happy Hour",
    items: [
      { productId: 1, name: "Cerveza Corona", quantity: 4, price: 5.0 },
      { productId: 2, name: "Margarita", quantity: 2, price: 8.5 },
    ],
  },
  {
    name: "Mesa VIP",
    items: [
      { productId: 3, name: "Whisky Jack Daniel's", quantity: 1, price: 12.0 },
      { productId: 4, name: "Vino Tinto", quantity: 1, price: 15.0 },
    ],
  },
]

type OrderItem = {
  productId: number
  quantity: number
  price: number
  name: string
}

export function OrderForm({ onClose }: { onClose: () => void }) {
  const [customerName, setCustomerName] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [note, setNote] = useState("")
  const [showFrequentOrders, setShowFrequentOrders] = useState(false)

  // Filtrar por búsqueda, categoría y popularidad
  const filteredProducts = SAMPLE_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.stock > 0 &&
      (activeCategory === "all" || product.category === activeCategory) &&
      (!showPopularOnly || product.popular),
  )

  const addItem = (product: (typeof SAMPLE_PRODUCTS)[0]) => {
    const existingItem = items.find((item) => item.productId === product.id)
    if (existingItem) {
      setItems(items.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          quantity: 1,
          price: product.price,
          name: product.name,
        },
      ])
    }
  }

  const updateQuantity = (productId: number, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }),
    )
  }

  const removeItem = (productId: number) => {
    setItems(items.filter((item) => item.productId !== productId))
  }

  const loadFrequentOrder = (frequentOrder: (typeof FREQUENT_ORDERS)[0]) => {
    setItems(frequentOrder.items)
    setShowFrequentOrders(false)
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el pedido
    console.log({ customerName, items, total, status: "pending", createdAt: new Date(), note })
    onClose()
  }

  // Obtener categorías únicas
  const categories = ["all", ...Array.from(new Set(SAMPLE_PRODUCTS.map((p) => p.category)))]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg border border-border/10 bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Nuevo Pedido</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre del Cliente</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                required
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
                      onClick={() => loadFrequentOrder(order)}
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

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 pl-10 pr-3 py-2 text-foreground"
                />
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    {category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowPopularOnly(!showPopularOnly)}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    showPopularOnly
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Star className="h-3 w-3" />
                  Populares
                </button>
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
                      {product.popular && <Star className="mr-2 h-3 w-3 text-primary" />}
                      <span>{product.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({product.stock} disponibles)</span>
                    </div>
                    <span className="text-primary">${product.price.toFixed(2)}</span>
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
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Productos Seleccionados</h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3"
                  >
                    <div>
                      <span className="text-sm">{item.name}</span>
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
                        <span className="text-sm">{item.quantity}</span>
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
              Crear Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

