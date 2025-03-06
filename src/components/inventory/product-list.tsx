"use client"

import type React from "react"

import { Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { ProductForm } from "./product-form"
import { useStore } from "../../lib/store"
import axios from "axios"

// Definir la interfaz para las categorías
interface Categoria {
  id: string
  nombre: string
}

export function ProductList({
  searchQuery,
  setSuccessMessage,
}: {
  searchQuery: string
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const { products, deleteProduct, fetchProducts } = useStore()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchProducts()
    // Cargar categorías
    axios
      .get("http://localhost:3004/api/categorias")
      .then((response) => {
        setCategorias(response.data)
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error)
      })
  }, [fetchProducts])

  useEffect(() => {
    if (setSuccessMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [setSuccessMessage])

  // Función para obtener el nombre de la categoría por su ID
  const getCategoryName = (categoryId: number | string) => {
    const categoria = categorias.find((cat) => cat.id.toString() === categoryId.toString())
    return categoria ? categoria.nombre : categoryId.toString()
  }

  console.log("Productos en el estado:", products) // Depuración

  // Aseguramos que products es un array antes de filtrar
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => product.nombre?.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  // Manejo de eliminación de producto con confirmación
  const handleDelete = async (id: number) => {
    setProductToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      await deleteProduct(productToDelete)
      setSuccessMessage("✅ Producto eliminado exitosamente.")
      fetchProducts() // Recargar lista de productos
      setShowDeleteConfirm(false)
      setProductToDelete(null)
    } catch (error) {
      console.error("Error eliminando producto:", error)
    }
  }

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
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Cantidad</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Categoría</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Vencimiento</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/10 last:border-0">
                    <td className="px-4 py-3 text-sm">{product.nombre}</td>
                    <td className="px-4 py-3 text-right text-sm">${product.precio_compra.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-sm">${product.precio_venta.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-medium ${
                          product.cantidad === 0
                            ? "bg-red-500/20 text-red-500"
                            : product.cantidad < 10
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-green-500/20 text-green-500"
                        }`}
                      >
                        {product.cantidad} unidades
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">{getCategoryName(product.categoria)}</td>
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
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/30 hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center text-sm text-muted-foreground">
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-border/10 bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-red-500 mb-2">Confirmar eliminación</h3>
            <p className="text-muted-foreground mb-4">
              ¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setProductToDelete(null)
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <ProductForm
          editProduct={editingProduct}
          onClose={() => setEditingProduct(null)}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </>
  )
}

