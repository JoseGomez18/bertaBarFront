import { Product, Category, Order, OrderItem } from "../types/inventario"; // Asegúrate de que la ruta sea correcta

export const API_URL = "http://localhost:3004/api"; // Ajusta el puerto si es necesario

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/productos`);
  return response.json();
};

export const fetchPedidos = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/ventas`);
  return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categorias`);
  return response.json();
};

export const createProduct = async (producto: Omit<Product, "id">): Promise<Product> => {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  return response.json();
};

export const updateProduct = async (id: number, producto: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_URL}/updateProduct`, { // Aquí corregí la URL
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...producto, id }), // Agregamos el ID en el body, ya que el backend lo espera ahí
  });
  return response.json();
};

export const registrarVenta = async (
  nombre: string,
  items: OrderItem[],
  servicio: number,
): Promise<{ ventaId: number; totalVenta: number }> => {
  // Transformar los items al formato que espera el backend
  const productos = items.map((item) => ({
    producto_id: item.productId,
    cantidad: item.cantidad,
  }))

  const response = await fetch(`${API_URL}/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, productos, servicio }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Error al registrar la venta")
  }

  return response.json()
}

// Función para actualizar estado de una venta
export const actualizarEstadoVenta = async (
  id: number,
  estado: "pendiente" | "completado" | "por deber",
): Promise<void> => {
  const response = await fetch(`${API_URL}/ventasEstado/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Error al actualizar estado")
  }
}



export const deleteProduct = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/deleteProduct/${id}`, { method: "DELETE" }); // Aquí corregí la URL
};

export const deletePedidos = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/deleteProduct/${id}`, { method: "DELETE" }); // Aquí corregí la URL
};

