import { create } from "zustand";
import axios from "axios";

export type Product = {
  id: number;
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  cantidad: number;
  fecha_vencimiento: string;
};

export type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
  name: string;
};

export type Order = {
  id: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "in_progress" | "completed";
  createdAt: Date;
};

type Store = {
  products: Product[];
  orders: Order[];
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

  fetchProducts: async () => {
    try {
      const response = await axios.get("http://localhost:3004/api/productos"); // Cambia la URL a tu API real
      console.log(response)
      set({ products: response.data });
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  },

  addProduct: async (product) => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/posts", product);
      set((state) => ({ products: [...state.products, response.data] }));
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, updatedProduct);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        ),
      }));
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
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
      orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
    })),
}));
