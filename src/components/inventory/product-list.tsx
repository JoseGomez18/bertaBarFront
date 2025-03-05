"use client"

import { Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { ProductForm } from "./product-form"
import { useStore } from "../../lib/store"

export function ProductList({ searchQuery }: { searchQuery: string }) {
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const { products, deleteProduct, fetchProducts } = useStore()
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  console.log("Productos en el estado:", products) // Depuración

  // Aseguramos que products es un array antes de filtrar
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

     // Manejo de eliminación de producto con confirmación
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      setSuccessMessage("Producto eliminado exitosamente.");
      fetchProducts(); // Recargar lista de productos
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };


  return (
    <>
    {successMessage && (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
    {successMessage}
  </div>
)}
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
      {editingProduct && (
        <ProductForm 
          editProduct={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          setSuccessMessage={setSuccessMessage} 
        />
      )}
    </>
  );
}
