"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { ProductForm } from "../../components/inventory/product-form"
import { ProductList } from "../../components/inventory/product-list"
import { useEffect } from "react";


export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]); // Escucha cambios en successMessage

  // Manejar el cierre del formulario
  const handleCloseForm = () => {
    setShowAddForm(false)
  }


  return (
    <div className="container mx-auto py-6 px-4">
      {successMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-muted-foreground">Gestiona tus productos</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Agregar Producto
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-border/10 rounded-lg bg-secondary/30"
        />
      </div>

      <ProductList searchQuery={searchQuery} setSuccessMessage={setSuccessMessage} />

      {showAddForm && <ProductForm onClose={handleCloseForm} setSuccessMessage={setSuccessMessage} />}
    </div>
  )
}

