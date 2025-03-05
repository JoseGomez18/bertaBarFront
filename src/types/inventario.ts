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
  