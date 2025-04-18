"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, CreditCard } from "lucide-react"
import BalanceTotal from "../../components/finanzas/BalanceTotal"
import IngresosMensuales from "../../components/finanzas/IngresosMensuales"
import GastosMensuales from "../../components/finanzas/GastosMensuales"
import TransaccionesRecientes from "../../components/finanzas/TransaccionesRecientes"
import VentasPorCategoria from "../../components/finanzas/VentasPorCategoria"
import RendimientoMensual from "../../components/finanzas/RendimientoMensual"
import IndicadoresFinancieros from "../../components/finanzas/IndicadoresFinancieros"
import MetasFinancieras from "../../components/finanzas/MetasFinancieras"
import SelectorPeriodo from "../../components/finanzas/SelectorPeriodo"
import Alertas from "../../components/finanzas/Alertas"
import { DatosFinancieros } from "../../types/finanzas";


// Datos de ejemplo actualizados para un bar pequeño
const datosFinancieros: DatosFinancieros  = {
  balance: 25000000,
  ingresos: 18000000,
  gastos: 12000000,
  transacciones: [
    { id: 1, descripcion: "Venta de bebidas", monto: 1500000, fecha: "2023-05-15", tipo: "ingreso" },
    { id: 2, descripcion: "Pago de nómina", monto: 3000000, fecha: "2023-05-14", tipo: "gasto" },
    { id: 3, descripcion: "Compra de licores", monto: 2000000, fecha: "2023-05-13", tipo: "gasto" },
    { id: 4, descripcion: "Ventas del día", monto: 5000000, fecha: "2023-05-12", tipo: "ingreso" },
  ],
  ventasPorCategoria: [
    { categoria: "Cervezas", monto: 5000000 },
    { categoria: "Cócteles", monto: 4000000 },
    { categoria: "Licores", monto: 3000000 },
    { categoria: "Comidas", monto: 2000000 },
  ],
  rendimientoMensual: [
    { mes: "Enero", ingresos: 15000000, gastos: 10000000 },
    { mes: "Febrero", ingresos: 16000000, gastos: 11000000 },
    { mes: "Marzo", ingresos: 18000000, gastos: 12000000 },
    { mes: "Abril", ingresos: 17000000, gastos: 11500000 },
    { mes: "Mayo", ingresos: 18000000, gastos: 12000000 },
  ],
  indicadoresFinancieros: [
    { nombre: "Margen de Beneficio", valor: "33.3%", descripcion: "Porcentaje de beneficio sobre las ventas" },
    { nombre: "Rotación de Inventario", valor: "5.2", descripcion: "Veces que el inventario se renueva al mes" },
    { nombre: "Costo de Productos", valor: "40%", descripcion: "Porcentaje del costo sobre las ventas" },
    { nombre: "Gastos Operativos", valor: "25%", descripcion: "Porcentaje de gastos operativos sobre ingresos" },
  ],
  metasFinancieras: [
    { nombre: "Meta de Ventas Mensual", meta: 20000000, actual: 18000000 },
    { nombre: "Límite de Gastos", meta: 10000000, actual: 12000000 },
    { nombre: "Margen de Beneficio", meta: 40, actual: 33.3 },
  ],
  alertas: [
    // {
    //   tipo: "warning",
    //   mensaje: "El margen de beneficio está por debajo del objetivo. Considere revisar los precios o reducir costos.",
    // },
    // {
    //   tipo: "info",
    //   mensaje: "Las ventas de cócteles han aumentado un 15% este mes. Considere promocionar más estos productos.",
    // },
    // {
    //   tipo: "danger",
    //   mensaje: "Los gastos operativos están cerca de superar el límite establecido. Se recomienda revisión.",
    // },
    { tipo: "success", mensaje: "La rotación de inventario ha mejorado. Buen trabajo en la gestión de stock." },
  ],
} 

export default function FinanzasPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("este-mes")

  return (
    <div className="min-h-screen bg-secondary text-foreground p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Panel Financiero</h1>
          <SelectorPeriodo periodoSeleccionado={periodoSeleccionado} setPeriodoSeleccionado={setPeriodoSeleccionado} />
        </div>

        <Alertas alertas={datosFinancieros.alertas} /> 

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BalanceTotal balance={datosFinancieros.balance} icon={DollarSign} />
          <IngresosMensuales ingresos={datosFinancieros.ingresos} icon={TrendingUp} />
          <GastosMensuales gastos={datosFinancieros.gastos} icon={CreditCard} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TransaccionesRecientes transacciones={datosFinancieros.transacciones} />
          <VentasPorCategoria ventas={datosFinancieros.ventasPorCategoria} />
        </div>

        <MetasFinancieras metas={datosFinancieros.metasFinancieras} />

        <div className="grid grid-cols-1 gap-4">
          <RendimientoMensual rendimiento={datosFinancieros.rendimientoMensual} />
          <IndicadoresFinancieros indicadores={datosFinancieros.indicadoresFinancieros} />
        </div>
      </div>
    </div>
  )
}

