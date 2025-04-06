"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, ArrowLeft, Save } from "lucide-react"
import axios from "axios" // Asegúrate de tener axios instalado
import type { Product } from "../../types/inventario"
import { useStore } from "../../lib/store"

type ProductFormData = Omit<Product, "id">

const initialData: ProductFormData = {
  nombre: "",
  precio_compra: 0,
  precio_venta: 0,
  cantidad: 1,
  fecha_vencimiento: "",
  categoria: 0, // Ahora será un ID en lugar de un texto
}

export function ProductForm({
  onClose,
  editProduct,
  setSuccessMessage,
}: {
  onClose: () => void
  editProduct?: Product
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>
}) {
  console.log("🟢 Props recibidos en ProductForm:", { onClose, editProduct, setSuccessMessage })
  const [formData, setFormData] = useState<ProductFormData>(initialData)
  const [showEditConfirm, setShowEditConfirm] = useState(false)
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([])
  const { addProduct, updateProduct, fetchProducts } = useStore()

  // Nuevos estados para la creación de categorías
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  // Obtener las categorías desde el backend
  useEffect(() => {
    axios
      .get("http://localhost:3004/api/categorias") // Asegúrate de usar la URL correcta de tu API
      .then((response) => {
        setCategorias(response.data)
        console.log("Categorías cargadas:", response.data)
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error)
      })
  }, [])

  // Cargar datos del producto a editar después de que las categorías se hayan cargado
  useEffect(() => {
    console.log("📌 editProduct recibido:", editProduct)
    if (editProduct && categorias.length > 0) {
      console.log("Cargando datos del producto para editar. Categoría del producto:", editProduct.categoria)

      // Intentar encontrar la categoría por nombre si es un string
      let categoriaId = 0

      if (typeof editProduct.categoria === "string") {
        // Si es un string, buscar la categoría por nombre
        const categoriaEncontrada = categorias.find(
          (cat) => cat.nombre.toLowerCase() === editProduct.categoria.toString().toLowerCase(),
        )

        if (categoriaEncontrada) {
          categoriaId = Number.parseInt(categoriaEncontrada.id)
          console.log("Categoría encontrada por nombre:", categoriaEncontrada.nombre, "ID:", categoriaId)
        }
      } else if (typeof editProduct.categoria === "number") {
        // Si ya es un número, usarlo directamente
        categoriaId = editProduct.categoria
        console.log("Usando ID de categoría directamente:", categoriaId)
      }

      setFormData({
        nombre: editProduct.nombre,
        precio_compra: editProduct.precio_compra,
        precio_venta: editProduct.precio_venta,
        cantidad: editProduct.cantidad,
        fecha_vencimiento: editProduct.fecha_vencimiento,
        categoria: categoriaId,
      })
    } else if (!editProduct) {
      setFormData(initialData)
    }
  }, [editProduct, categorias])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("🚀 Enviando producto...")

    const productoAEnviar = {
      ...formData,
      categoria_id: formData.categoria, // Renombramos `categoria` a `categoria_id`
    }

    console.log("📦 Datos a enviar:", productoAEnviar)

    try {
      let response

      if (editProduct) {
        if (!showEditConfirm) {
          setShowEditConfirm(true)
          return
        }

        // Si estamos editando, usamos PUT en lugar de POST
        response = await axios.put(`http://localhost:3004/api/updateProduct`, {
          ...productoAEnviar,
          id: editProduct.id, // Aseguramos que el ID esté en el body
        })
        console.log("✏️ Producto editado con éxito:", response.data)

        updateProduct(editProduct.id, {
          ...formData,
          id: editProduct.id, // Mantenemos el ID del producto editado
        })

        setSuccessMessage("✅ Producto actualizado exitosamente!")
        setShowEditConfirm(false)
      } else {
        // Si estamos creando, usamos POST
        response = await axios.post("http://localhost:3004/api/productos", productoAEnviar)
        console.log("✅ Producto creado con éxito:", response.data)

        if (!response.data.id) {
          throw new Error("La respuesta del servidor no incluye un ID válido.")
        }

        addProduct({
          ...formData,
          id: response.data.id as number,
        } as Product)
        setSuccessMessage("✅ Producto agregado exitosamente!")
      }

      // Actualizar la lista de productos
      await fetchProducts()

      // Cerrar el modal
      if (typeof onClose === "function") {
        onClose()
      }

      // Limpiar el formulario solo si se creó un nuevo producto
      if (!editProduct) {
        setFormData(initialData)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error al procesar la solicitud:", error.response?.data)
        alert(error.response?.data?.error || "Hubo un error en la operación")
      } else {
        console.error("🚨 Error inesperado:", error)
        alert("Ocurrió un error inesperado")
      }
    }
  }

  // Función para manejar la creación de una nueva categoría
  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return

    try {
      // Enviar la nueva categoría al servidor
      const response = await axios.post("http://localhost:3004/api/categorias", {
        nombre: newCategory.trim(),
      })

      console.log("✅ Categoría creada con éxito:", response.data)

      // Agregar la nueva categoría a la lista local
      const nuevaCategoria = {
        id: response.data.id.toString(),
        nombre: newCategory.trim(),
      }

      setCategorias([...categorias, nuevaCategoria])

      // Seleccionar la nueva categoría
      setFormData({ ...formData, categoria: Number(nuevaCategoria.id) })

      // Limpiar y ocultar el formulario de nueva categoría
      setNewCategory("")
      setShowNewCategory(false)
    } catch (error) {
      console.error("❌ Error al crear la categoría:", error)
      alert("Error al crear la categoría")
    }
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

          {/* Select para Categoría con opción para agregar nueva */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {showNewCategory ? "Nueva Categoría" : "Categoría"}
            </label>

            {!showNewCategory ? (
              <div className="flex gap-2">
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: Number(e.target.value) })}
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                  title="Agregar nueva categoría"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nombre de la categoría"
                    className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false)
                      setNewCategory("")
                    }}
                    className="flex items-center gap-1 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Save className="h-4 w-4" />
                    Guardar Categoría
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Precio Compra</label>
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
              <label className="block text-sm font-medium text-muted-foreground mb-1">Precio Venta</label>
              <input
                type="number"
                value={formData.precio_venta}
                onChange={(e) => setFormData({ ...formData, precio_venta: Number(e.target.value) })}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Cantidad</label>
            <input
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Fecha de Vencimiento</label>
            <input
              type="date"
              value={formData.fecha_vencimiento}
              onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
              required
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
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {editProduct ? "Guardar Cambios" : "Agregar Producto"}
            </button>
          </div>
        </form>

        {showEditConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-lg border border-border/10 bg-card p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-amber-500 mb-2">Confirmar edición</h3>
              <p className="text-muted-foreground mb-4">
                ¿Estás seguro que deseas guardar los cambios en este producto?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditConfirm(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

