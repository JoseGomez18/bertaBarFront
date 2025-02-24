"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { ProductForm } from "../../components/inventory/product-form"
import { ProductList } from "../../components/inventory/product-list"

export default function InventoryPage() {
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">Inventario</h1>
          <p className="text-muted-foreground">Gestiona tus productos y existencias</p>
        </div>

        <button
          onClick={() => setIsAddingProduct(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Agregar Producto
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border/10 bg-secondary/30 px-10 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <ProductList searchQuery={searchQuery} />

      {isAddingProduct && <ProductForm onClose={() => setIsAddingProduct(false)} />}
    </div>
  )
}

