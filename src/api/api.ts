import { Product, Category } from "../types/inventario"; // Asegúrate de que la ruta sea correcta

export const API_URL = "http://localhost:3004/api"; // Ajusta el puerto si es necesario

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/productos`);
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
  
  export const deleteProduct = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/deleteProduct/${id}`, { method: "DELETE" }); // Aquí corregí la URL
  };
  