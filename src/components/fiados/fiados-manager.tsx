"use client"

import { useState } from "react"
import { FiadoList } from "./fiados-list"
import { FiadoDetails } from "./fiado-details"
import { AddFiadoOrder } from "./add-fiado-order"
import { Plus } from "lucide-react"

export function FiadosManager() {
  const [selectedFiado, setSelectedFiado] = useState<any | null>(null)
  const [isAddingOrder, setIsAddingOrder] = useState(false)

  const handleSelectFiado = (fiado: any) => {
    setSelectedFiado(fiado)
    setIsAddingOrder(false)
  }

  const handleBack = () => {
    setSelectedFiado(null)
    setIsAddingOrder(false)
  }

  const handleAddOrder = (fiadoId: string) => {
    setIsAddingOrder(true)
  }

  const handleOrderAdded = (order: any) => {
    // Aquí iría la lógica para agregar el pedido al fiado
    console.log("Nuevo pedido agregado:", order)

    // Actualizar el fiado seleccionado con el nuevo pedido
    if (selectedFiado) {
      const updatedFiado = {
        ...selectedFiado,
        pedidos: [...selectedFiado.pedidos, order],
        total: selectedFiado.total + order.total,
        ultimaActualizacion: new Date(),
      }
      setSelectedFiado(updatedFiado)
    }

    setIsAddingOrder(false)
  }

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: "#090f1e" }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Cuentas por Cobrar</h1>
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
          <Plus className="h-4 w-4 inline mr-1" />
          Nueva Cuenta
        </button>
      </div>

      {isAddingOrder && selectedFiado ? (
        <AddFiadoOrder
          fiadoId={selectedFiado.id}
          fiadoName={selectedFiado.nombre}
          onBack={() => setIsAddingOrder(false)}
          onAddOrder={handleOrderAdded}
        />
      ) : selectedFiado ? (
        <FiadoDetails fiado={selectedFiado} onBack={handleBack} onAddOrder={handleAddOrder} />
      ) : (
        <FiadoList onSelectFiado={handleSelectFiado} />
      )}
    </div>
  )
}

