"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Search, Trash, X } from "lucide-react"

type AddFiadoOrderProps = {
  fiadoId: string
  fiadoName: string
  onBack: () => void
  onAddOrder: (order: any) => void
}

export function AddFiadoOrder({ fiadoId, fiadoName, onBack, onAddOrder }: AddFiadoOrderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  // Productos de ejemplo
  const products = [
    { id: 1, name: "Hamburguesa Especial", price: 12.5, category: "Comidas" },
    { id: 2, name: "Cerveza Artesanal", price: 5.0, category: "Bebidas" },
    { id: 3, name: "Alitas BBQ", price: 18.5, category: "Comidas" },
    { id: 4, name: "Refresco", price: 5.0, category: "Bebidas" },
    { id: 5, name: "Parrillada Mixta", price: 65.0, category: "Comidas" },
    { id: 6, name: "Vino Tinto", price: 20.0, category: "Bebidas" },
    { id: 7, name: "Ensalada César", price: 15.0, category: "Comidas" },
    { id: 8, name: "Postre del Día", price: 10.0, category: "Postres" },
    { id: 9, name: "Pizza Familiar", price: 30.0, category: "Comidas" },
    { id: 10, name: "Refresco Familiar", price: 15.0, category: "Bebidas" },
  ]

  const filteredProducts =
    searchTerm.trim() === ""
      ? products
      : products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()),
        )

  const handleAddProduct = (product: any) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id)

    if (existingProduct) {
      setSelectedProducts(selectedProducts.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)))
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
    }
  }

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
  }

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId)
      return
    }

    setSelectedProducts(selectedProducts.map((p) => (p.id === productId ? { ...p, quantity } : p)))
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }

  const handleSubmit = () => {
    if (selectedProducts.length === 0) {
      alert("Debe agregar al menos un producto")
      return
    }

    const newOrder = {
      id: `P${Date.now().toString().slice(-4)}`,
      fiadoId,
      fecha: new Date(),
      productos: selectedProducts.map((p) => ({
        productId: p.id,
        producto: p.name,
        cantidad: p.quantity,
        precio: p.price,
      })),
      total: calculateTotal(),
      pagado: 0,
    }

    onAddOrder(newOrder)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-lg border border-gray-700 p-4" style={{ backgroundColor: "#131c31" }}>
        <h2 className="text-lg font-semibold text-white mb-2">Agregar Pedido a Fiado</h2>
        <p className="text-gray-400">
          Cliente: <span className="text-white">{fiadoName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Seleccionar Productos</h3>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-700 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              style={{ backgroundColor: "#131c31" }}
            />
          </div>

          <div
            className="rounded-lg border border-gray-700 overflow-hidden max-h-[400px] overflow-y-auto"
            style={{ backgroundColor: "#131c31" }}
          >
            <div className="divide-y divide-gray-700">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No se encontraron productos</div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 hover:bg-[#1a253d]"
                    style={{ backgroundColor: "#131c31" }}
                  >
                    <div>
                      <h4 className="font-medium text-white">{product.name}</h4>
                      <div className="text-xs text-gray-400">{product.category}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-orange-500 font-medium">${product.price.toFixed(2)}</div>
                      <button
                        onClick={() => handleAddProduct(product)}
                        className="rounded-full p-1 text-white hover:bg-orange-500 transition-colors"
                        style={{ backgroundColor: "#1a253d" }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Resumen del Pedido</h3>

          <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ backgroundColor: "#131c31" }}>
            {selectedProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No hay productos seleccionados</div>
            ) : (
              <div className="divide-y divide-gray-700">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{product.name}</h4>
                      <div className="text-xs text-gray-400">${product.price.toFixed(2)} c/u</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                          className="rounded-l-md border border-gray-700 px-2 py-1 text-gray-300 hover:bg-[#1a253d]"
                          style={{ backgroundColor: "#1a253d" }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(product.id, Number.parseInt(e.target.value) || 1)}
                          className="w-12 border-y border-gray-700 py-1 text-center text-white"
                          style={{ backgroundColor: "#131c31" }}
                        />
                        <button
                          onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                          className="rounded-r-md border border-gray-700 px-2 py-1 text-gray-300 hover:bg-[#1a253d]"
                          style={{ backgroundColor: "#1a253d" }}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-orange-500 font-medium w-20 text-right">
                        ${(product.price * product.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="rounded-full p-1 text-white hover:bg-red-500 transition-colors"
                        style={{ backgroundColor: "#1a253d" }}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-700 p-4" style={{ backgroundColor: "#131c31" }}>
            <div className="flex justify-between font-medium text-lg">
              <span className="text-white">Total:</span>
              <span className="text-orange-500">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={selectedProducts.length === 0}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                selectedProducts.length === 0 ? "bg-gray-700 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Agregar a Fiado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

