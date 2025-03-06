import { create } from "zustand";
import { Product, Order } from "../types/inventario";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/api"; // Importamos la API

type Store = {
  products: Product[];
  orders: Order[];
  successMessage: string | null; // ✅ Estado para el mensaje de éxito
  setSuccessMessage: (message: string | null) => void; // ✅ Función para actualizar el mensaje


  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  updateOrderStatus: (id: number, status: Order["status"]) => void;
  fetchProducts: () => Promise<void>;
};

export const useStore = create<Store>((set) => ({
  products: [],
  orders: [],
  successMessage: null, // ✅ Inicializamos en `null`

  setSuccessMessage: (message) => set({ successMessage: message }), // ✅ Función para actualizar el mensaje

  fetchProducts: async () => {
    try {
      const data = await fetchProducts();
      set({ products: data });
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await createProduct(product);
      set((state) => ({
         products: [...state.products, newProduct] ,
         successMessage: "Producto agregado con éxito", // ✅ Asignar mensaje de éxito
        }));
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      await updateProduct(id, updatedProduct);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        ),
        successMessage: "Producto actualizado con éxito", // ✅ Mensaje de éxito
      }));
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        successMessage: "Producto eliminado con éxito", // ✅ Mensaje de éxito
      }));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  },

  addOrder: (order) =>
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...order,
          id: Math.max(0, ...state.orders.map((o) => o.id)) + 1,
          createdAt: new Date(),
        },
      ],
    })),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    })),
}));
