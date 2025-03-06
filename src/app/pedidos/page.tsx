"use client"

import { useState } from "react"
import PedidosLayout from "../../components/pedidos/PedidosLayout"
import ListadoPedidos from "../../components/pedidos/ListadoPedidos"
import PedidosCompletados from "../../components/pedidos/PedidosCompletados"
import FiltroPedidos from "../../components/pedidos/FiltroPedidos"
import FormularioPedido from "../../components/pedidos/FormularioPedido"
import EstadisticasPedidos from "../../components/pedidos/EstadisticasPedidos"
import ResumenDiario from "../../components/pedidos/ResumenDiario"
import ModalPedidoCompletado from "../../components/pedidos/ModalPedidoCompletado"

export default function PedidosPage() {
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)

  return (
    <PedidosLayout>
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Panel lateral izquierdo */}
        <div className="lg:col-span-3 space-y-6">
          <FormularioPedido />
          <EstadisticasPedidos />
        </div>

        {/* Panel central */}
        <div className="lg:col-span-6 space-y-6">
          <FiltroPedidos />
          <ListadoPedidos />
        </div>

        {/* Panel lateral derecho */}
        <div className="lg:col-span-3 space-y-6">
          <ResumenDiario />
          <PedidosCompletados onPedidoClick={setPedidoSeleccionado} />
        </div>
      </div>
      {pedidoSeleccionado && (
        <ModalPedidoCompletado pedido={pedidoSeleccionado} onClose={() => setPedidoSeleccionado(null)} />
      )}
    </PedidosLayout>
  )
}

