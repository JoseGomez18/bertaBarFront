"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useStore, type Product } from "../../lib/store"

type ProductFormData = Omit<Product, "id">

const initialData: ProductFormData = {
  nombre: "",
  precio_compra: 0,
  precio_venta: 0,
  cantidad: 1,
  fecha_vencimiento: "s",
  categoria: "bebidas",
}

export function ProductForm({
  onClose,
  editProduct,
}: {
  onClose: () => void
  editProduct?: Product
}) {
  const [formData, setFormData] = useState<ProductFormData>(editProduct || initialData)
  const { addProduct, updateProduct } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editProduct) {
      updateProduct(editProduct.id, formData)
    } else {
      addProduct(formData)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border/10 bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{editProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Categoría</label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
              required
            />
            {/* <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
            >
              <option value="bebidas">Bebidas</option>
              <option value="cocteles">Cócteles</option>
              <option value="cervezas">Cervezas</option>
              <option value="vinos">Vinos</option>
              <option value="licores">Licores</option>
            </select> */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Precio</label>
              <input
                type="number"
                value={formData.precio_compra}
                onChange={(e) => setFormData({ ...formData, precio_compra: Number(e.target.value) })}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Stock</label>
              <input
                type="number"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                min="0"
                required
              />
            </div>
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
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {editProduct ? "Guardar Cambios" : "Agregar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

