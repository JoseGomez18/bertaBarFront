"use client"

import { Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { ProductForm } from "./product-form"
import { useStore } from "../../lib/store"

export function ProductList({ searchQuery }: { searchQuery: string }) {
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const { products, deleteProduct, fetchProducts } = useStore()

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <div className="rounded-lg border border-border/10 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Producto</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Precio compra</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Precio venta</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">cantidad</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">categoria</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">vencimiento</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border/10 last:border-0">
                  <td className="px-4 py-3 text-sm">{product.nombre}</td>
                  <td className="px-4 py-3 text-right text-sm">${product.precio_compra.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-sm">${product.precio_venta.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-medium ${product.cantidad === 0
                        ? "bg-red-500/20 text-red-500"
                        : product.cantidad < 10
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-green-500/20 text-green-500"
                        }`}
                    >
                      {product.cantidad} unidades
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">{product.categoria}</td>
                  <td className="px-4 py-3 text-right text-sm">{product.fecha_vencimiento}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/30 hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && <ProductForm editProduct={editingProduct} onClose={() => setEditingProduct(null)} />}
    </>
  )
}
