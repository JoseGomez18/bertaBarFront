export type Product = {
  id: number;
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  cantidad: number;
  fecha_vencimiento: string;
  categoria: number;
};

export type OrderItem = {
  // productId: number;
  cantidad: number;
  price: number;
  producto: string;
  serviceCharge?: number; // Agregado como opcional
  category?: number; //
};

export type Order = {
  id: number;
  nombre: string;
  productos: OrderItem[];
  total: number;
  estado: "pendiente" | "in_progress" | "completado";
  createdAt: Date;
  type?: "mesa" | "llevar"; // Agregado como opcional
  note?: string;
};

export type Category = {
  id: number;
  nombre: string;
};