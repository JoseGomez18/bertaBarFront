"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { FileText, Minus, Plus, Search, Star, X, Coffee, ShoppingBag, AlertCircle } from 'lucide-react'
import { fetchProducts, fetchCategories, registrarVenta, actualizarVenta } from "../../api/api"
import type { Product, Category, OrderItem } from "../../types/inventario"
import { useStore } from "../../lib/store"

type OrderFormProps = {
  onClose: () => void
  orderType?: "mesa" | "llevar" | null
  editOrderId?: number | null
}

export function OrderForm({ onClose, orderType = null, editOrderId = null }: OrderFormProps) {
  const [customerName, setCustomerName] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [note, setNote] = useState("")
  const [showFrequentOrders, setShowFrequentOrders] = useState(false)
  const [formType, setFormType] = useState<"mesa" | "llevar" | "editar">(
    editOrderId ? "editar" : orderType === "llevar" ? "llevar" : "mesa",
  )
  const [orderStatus, setOrderStatus] = useState<"pending" | "in_progress" | "completed">("pending")
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash")
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [showServiceChargeDialog, setShowServiceChargeDialog] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [servicioGeneral, setServicioGeneral] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cálculos de totales
  const calcularSubtotalProductos = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }, [items]);

  const calcularTotalServiciosPorProducto = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.serviceCharge || 0), 0);
  }, [items]);

  // El total es la suma del subtotal de productos + servicios por producto + servicio general adicional
  const calcularTotal = useCallback(() => {
    const subtotal = calcularSubtotalProductos();
    const serviciosPorProducto = calcularTotalServiciosPorProducto();
    const servicioGeneralAdicional = servicioGeneral;

    return subtotal + serviciosPorProducto + servicioGeneralAdicional;
  }, [calcularSubtotalProductos, calcularTotalServiciosPorProducto, servicioGeneral]);

  // Cargar productos y categorías
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([fetchProducts(), fetchCategories()])
        setProducts(productsData)
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Error al cargar los datos. Por favor, intente de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Cargar datos del pedido si estamos editando
  useEffect(() => {
    if (editOrderId) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`http://localhost:3004/api/ventasDetalleId/${editOrderId}`);
          const data = await response.json();

          console.log("Pedido cargado:", data);

          if (data && data.length > 0) {
            const order = data[0];
            setCustomerName(order.nombre || "");

            // Transformar los productos para incluir serviceCharge
            const orderItems: OrderItem[] = order.productos.map((prod: any) => ({
              productId: prod.productId,
              producto: prod.producto,
              cantidad: prod.cantidad,
              precio: parseFloat(prod.precio || 0),
              serviceCharge: parseFloat(prod.servicio_producto || 0)
            }));

            setItems(orderItems);
            setOrderStatus(order.estado || "pending");
            setNote(order.note || "");

            // Asegurarse de que el servicio general sea un valor numérico
            setServicioGeneral(parseFloat(order.servicio_general || 0));
          }
        } catch (error) {
          console.error("Error cargando la orden:", error);
        }
      };
      fetchOrder();
    }
  }, [editOrderId]);

  const updateOrderStatus = (status: "pending" | "in_progress" | "completed") => {
    setOrderStatus(status)
  }

  const addItem = (product: Product) => {
    const existingItem = items.find((item) => item.productId === product.id)
    if (existingItem) {
      setItems(items.map((item) => (item.productId === product.id ? { ...item, cantidad: item.cantidad + 1 } : item)))
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          producto: product.nombre,
          cantidad: 1,
          precio: product.precio_venta,
          category: product.categoria,
          serviceCharge: 0,
        },
      ])
    }
  }

  const updateQuantity = (productId: number, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.productId === productId) {
          const newQuantity = item.cantidad + delta
          return newQuantity > 0 ? { ...item, cantidad: newQuantity } : item
        }
        return item
      }),
    )
  }

  const removeItem = (productId: number) => {
    setItems(items.filter((item) => item.productId !== productId))
  }

  const handleServiceCharge = (productId: number) => {
    setSelectedProductId(productId)
    setShowServiceChargeDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0 || !customerName) {
      setSubmitError("Debe agregar al menos un producto y proporcionar un nombre para el pedido.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;

      // Preparar los datos para enviar al backend
      const productos = items.map(item => ({
        producto_id: item.productId,
        cantidad: item.cantidad,
        servicio: item.serviceCharge || 0
      }));

      if (editOrderId) {
        // Actualizar venta existente
        console.log("Actualizando venta con datos:", {
          id: editOrderId,
          nombre: customerName,
          productos,
          servicioGeneral: servicioGeneral
        });

        result = await actualizarVenta(
          editOrderId,
          customerName,
          items,
          servicioGeneral
        );
      } else {
        // Crear nueva venta
        console.log("Registrando nueva venta con datos:", {
          nombre: customerName,
          productos,
          servicioGeneral: servicioGeneral
        });

        result = await registrarVenta(
          customerName,
          items,
          servicioGeneral
        );
      }

      console.log("Venta procesada exitosamente:", result);
      setSubmitSuccess(true);

      // Actualizar pedidos en el estado global
      useStore.getState().fetchPedidos();
      useStore.getState().triggerRefresh();

      // Cerrar el formulario después de actualizar
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      setSubmitError(error instanceof Error ? error.message : "Error desconocido al registrar la venta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    if (editOrderId) {
      return "Editar Pedido Existente"
    }
    return formType === "llevar" ? "Pedido Para Llevar" : "Nuevo Pedido en Mesa"
  }

  const uniqueCategories = ["all", ...Array.from(new Set(categories.map((c) => c.nombre)))]

  const filteredProducts: Product[] = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.cantidad > 0 &&
      (activeCategory === "all" || String(product.categoria) === activeCategory),
  )

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {editOrderId ? "¡Pedido Actualizado!" : "¡Venta Registrada!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {editOrderId
              ? "El pedido se ha actualizado exitosamente."
              : "La venta se ha registrado exitosamente."}
          </p>
        </div>
      </div>
    )
  }

  // Calcular los totales para mostrar
  const subtotalProductos = calcularSubtotalProductos();
  const totalServiciosPorProducto = calcularTotalServiciosPorProducto();
  const total = calcularTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-lg border border-border/10 bg-card p-4 shadow-lg my-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{getFormTitle()}</h2>
            {!editOrderId && (
              <div className="flex rounded-lg border border-border/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormType("mesa")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs ${formType === "mesa" ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  <Coffee className="h-3 w-3" />
                  Mesa
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("llevar")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs ${formType === "llevar"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  <ShoppingBag className="h-3 w-3" />
                  Para Llevar
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitError && (
          <div className="mb-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {formType === "llevar" ? "Nombre del Cliente" : "Mesa / Ubicación"}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                required
                placeholder={formType === "llevar" ? "Nombre del cliente" : "Ej: Mesa 1, Barra 2"}
                disabled={editOrderId !== null} // Deshabilitar si estamos editando
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Pedidos Frecuentes</label>
              <button
                type="button"
                onClick={() => setShowFrequentOrders(!showFrequentOrders)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              >
                <Star className="h-4 w-4" />
                Cargar Pedido Frecuente
              </button>
            </div> */}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 pl-10 pr-3 py-2 text-foreground"
                />
              </div>

              <div className="mb-2 flex flex-wrap gap-2">
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                  >
                    {category === "all" ? "Todos" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addItem(product)}
                    className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-3 text-sm hover:bg-secondary/50"
                  >
                    <div className="flex items-center">
                      <span>{product.nombre}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({product.cantidad} disponibles)</span>
                    </div>
                    <span className="text-primary">${product.precio_venta.toFixed(2)}</span>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="rounded-lg border border-border/10 bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                    No se encontraron productos
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Productos Seleccionados</h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col rounded-lg border border-border/10 bg-secondary/30 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">{item.producto}</span>
                        <span className="ml-2 text-xs text-primary">${item.precio.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-sm">{item.cantidad}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="rounded-lg p-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 border-t border-border/10 pt-2">
                      <button
                        type="button"
                        onClick={() => handleServiceCharge(item.productId)}
                        className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors ${(item.serviceCharge || 0) > 0
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/10 bg-secondary/20 text-muted-foreground hover:bg-secondary/30"
                          }`}
                      >
                        <Plus className="h-3 w-3" />
                        {(item.serviceCharge || 0) > 0
                          ? `Servicio: $${(item.serviceCharge || 0).toFixed(2)}`
                          : "Agregar servicio"}
                      </button>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="rounded-lg border border-border/10 bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                    No hay productos seleccionados
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-border/10 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Subtotal Productos</span>
                      <span className="font-medium">${subtotalProductos.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Servicios por Producto</span>
                      <span className="font-medium">${totalServiciosPorProducto.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Servicio General Adicional</span>
                        <input
                          type="number"
                          value={servicioGeneral}
                          onChange={(e) => setServicioGeneral(Number(e.target.value))}
                          className="w-24 rounded-lg border border-border/10 bg-secondary/30 px-2 py-1 text-right text-foreground"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <span className="font-medium">${servicioGeneral.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/10 pt-2 mt-2">
                      <span className="text-base font-bold">Total</span>
                      <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Notas del pedido
                  </div>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Instrucciones especiales, preferencias, etc."
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                  rows={2}
                />
              </div>
              {/* <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => updateOrderStatus("pending")}
                  className={`rounded-lg px-3 py-1 text-sm ${orderStatus === "pending"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  Pendiente
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus("in_progress")}
                  className={`rounded-lg px-3 py-1 text-sm ${orderStatus === "in_progress"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  En Preparación
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus("completed")}
                  className={`rounded-lg px-3 py-1 text-sm ${orderStatus === "completed"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-secondary/30 text-muted-foreground"
                    }`}
                >
                  Completado
                </button>
              </div> */}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={items.length === 0 || !customerName || isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-r-2 border-primary-foreground rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : editOrderId ? (
                "Actualizar Pedido"
              ) : (
                "Crear Pedido"
              )}
            </button>
          </div>
        </form>
        {showServiceChargeDialog && selectedProductId && (
          <ServiceChargeDialog
            isOpen={showServiceChargeDialog}
            onClose={() => {
              setShowServiceChargeDialog(false)
              setSelectedProductId(null)
            }}
            onConfirm={(amount) => {
              setItems(
                items.map((item) => (item.productId === selectedProductId ? { ...item, serviceCharge: amount } : item)),
              )
              setShowServiceChargeDialog(false)
              setSelectedProductId(null)
            }}
            initialValue={items.find((item) => item.productId === selectedProductId)?.serviceCharge || 0}
          />
        )}
      </div>
    </div>
  )
}

// ServiceChargeDialog Component
function ServiceChargeDialog({
  isOpen,
  onClose,
  onConfirm,
  initialValue,
}: { isOpen: boolean; onClose: () => void; onConfirm: (amount: number) => void; initialValue: number }) {
  const [amount, setAmount] = useState(initialValue)

  useEffect(() => {
    setAmount(initialValue)
  }, [initialValue])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-border/10 bg-card p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Agregar Cargo de Servicio</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">Monto del Servicio</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
            min="0"
            step="1000"
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
            type="button"
            onClick={() => onConfirm(amount)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}