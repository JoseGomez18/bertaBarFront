"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus, Search, X } from "lucide-react"
import { useStore } from "../../lib/store"
import type { OrderItem } from "../../lib/store"

export function OrderForm({ onClose }: { onClose: () => void }) {
  const [customerName, setCustomerName] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { products, addOrder } = useStore()

  const filteredProducts = products.filter(
    (product) => product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) && product.cantidad > 0,
  )

  const addItem = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = items.find((item) => item.productId === productId)
    if (existingItem) {
      setItems(items.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setItems([
        ...items,
        {
          productId,
          quantity: 1,
          price: product.precio_compra,
          name: product.nombre,
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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addOrder({
      customerName,
      items,
      total,
      status: "pending",
    })
    onClose()
  }

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
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre del Cliente</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
              required
            />
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

              <div className="grid gap-2 max-h-[400px] overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addItem(product.id)}
                    className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3 text-sm hover:bg-secondary/50"
                  >
                    <span>{product.nombre}</span>
                    <span className="text-primary">${product.precio_compra.toFixed(2)}</span>
                  </button>
                ))}
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
                    <span className="text-sm">{item.name}</span>

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

                {items.length > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t border-border/10 pt-4">
                    <span className="font-medium">Total</span>
                    <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                )}
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

