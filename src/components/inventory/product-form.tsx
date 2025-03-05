"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios"; // Asegúrate de tener axios instalado
import type { Product } from "../../types/inventario";
import { useStore } from "../../lib/store";

type ProductFormData = Omit<Product, "id">;

const initialData: ProductFormData = {
  nombre: "",
  precio_compra: 0,
  precio_venta: 0,
  cantidad: 1,
  fecha_vencimiento: "",
  categoria: 0, // Ahora será un ID en lugar de un texto
};

export function ProductForm({
  onClose,
  editProduct,
  setSuccessMessage, 
}: {
  onClose: () => void;
  editProduct?: Product;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  console.log("🟢 Props recibidos en ProductForm:", { onClose, editProduct, setSuccessMessage });
  const [formData, setFormData] = useState<ProductFormData>(editProduct || initialData);
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);
  const { addProduct, updateProduct, fetchProducts  } = useStore();


  // Obtener las categorías desde el backend
  useEffect(() => {
    axios.get("http://localhost:3004/api/categorias") // Asegúrate de usar la URL correcta de tu API
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("🚀 Enviando producto...");
    
    const productoAEnviar = {
      ...formData,
      categoria_id: formData.categoria, // Renombramos `categoria` a `categoria_id`
    };
  
    console.log("📦 Datos a enviar:", productoAEnviar);
  
    try {
      let response;
  
      if (editProduct) {
        // Si estamos editando, usamos PUT en lugar de POST
        response = await axios.put(`http://localhost:3004/api/updateProduct/${editProduct.id}`, productoAEnviar);
        console.log("✏️ Producto editado con éxito:", response.data);
        
        updateProduct(editProduct.id, {
          ...formData,
          id: editProduct.id, // Mantenemos el ID del producto editado
        });
        
        setSuccessMessage("✅ Producto actualizado exitosamente!");
      } else {
        // Si estamos creando, usamos POST
        response = await axios.post("http://localhost:3004/api/productos", productoAEnviar);
        console.log("✅ Producto creado con éxito:", response.data);
  
        if (!response.data.id) {
          throw new Error("La respuesta del servidor no incluye un ID válido.");
        }
  
        addProduct({
          ...formData,
          id: response.data.id as number,
        } as Product);
        setSuccessMessage("✅ Producto agregado exitosamente!");
      }
  
      // Actualizar la lista de productos
      await fetchProducts();
  
      // Cerrar el modal
      if (typeof onClose === "function") {
        onClose();
      }
  
      // Limpiar el formulario solo si se creó un nuevo producto
      if (!editProduct) {
        setFormData(initialData);
      }
  
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error al procesar la solicitud:", error.response?.data);
        alert(error.response?.data?.error || "Hubo un error en la operación");
      } else {
        console.error("🚨 Error inesperado:", error);
        alert("Ocurrió un error inesperado");
      }
    }
  };  
  
  
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

          {/* Select para Categoría */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Categoría</label>
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
      </div>
    </div>
  );
}
