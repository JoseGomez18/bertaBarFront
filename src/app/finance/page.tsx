"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useStore } from "../../lib/store"
import { ChevronLeft, ChevronRight, DollarSign, TrendingDown, TrendingUp } from "lucide-react"

export default function FinancePage() {
  const { finanzas, fetchFinanzas } = useStore()
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)

  useEffect(() => {
    fetchFinanzas()
  }, [fetchFinanzas])

  // Si no hay datos financieros, mostrar un mensaje de carga
  if (finanzas.length === 0) {
    return <p className="text-slate-400">Cargando datos financieros...</p>
  }

  const currentData = finanzas[currentMonthIndex]
  const prevData = currentMonthIndex > 0 ? finanzas[currentMonthIndex - 1] : null

  // Calcular cambios porcentuales con manejo de casos donde los valores previos son 0
  const incomeChange =
    prevData && prevData.ingresos !== 0
      ? ((currentData.ingresos - prevData.ingresos) / Math.abs(prevData.ingresos)) * 100
      : 0

  const expensesChange =
    prevData && prevData.gastos !== 0 ? ((currentData.gastos - prevData.gastos) / Math.abs(prevData.gastos)) * 100 : 0

  const profitChange =
    prevData && prevData.beneficio !== 0
      ? ((currentData.beneficio - prevData.beneficio) / Math.abs(prevData.beneficio)) * 100
      : 0

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonthIndex < finanzas.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Función mejorada para obtener el nombre del mes
  const getNombreMes = (numeroMes: string) => {
    console.log("Número de mes recibido:", numeroMes) // Depuración

    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]

    // Intentar diferentes formatos
    let index = -1

    // Si es un número de mes simple (1-12)
    if (/^\d{1,2}$/.test(numeroMes)) {
      index = Number.parseInt(numeroMes, 10) - 1
    }
    // Si es un formato año-mes (YYYY-MM)
    else if (/^\d{4}-\d{2}$/.test(numeroMes)) {
      index = Number.parseInt(numeroMes.split("-")[1], 10) - 1
    }
    // Si es solo el mes con ceros a la izquierda (01, 02, etc.)
    else if (/^0\d$/.test(numeroMes)) {
      index = Number.parseInt(numeroMes, 10) - 1
    }

    if (index >= 0 && index < 12) {
      return meses[index]
    }

    return `Mes inválido (${numeroMes})`
  }

  // Calcular el progreso con manejo de casos donde los ingresos son 0
  const calculateProgress = (value: number) => {
    if (currentData.ingresos <= 0) return value > 0 ? 100 : 0
    const progress = (value / Math.abs(currentData.ingresos)) * 100
    return Math.min(Math.max(progress, 0), 100) // Limitar entre 0 y 100
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">Finanzas</h1>
          <p className="text-muted-foreground">Gestión financiera del bar</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full">
          <button
            onClick={handlePrevMonth}
            disabled={currentMonthIndex === 0}
            className="rounded-full p-1 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium text-slate-100">{getNombreMes(currentData.mes)}</span>
          <button
            onClick={handleNextMonth}
            disabled={currentMonthIndex === finanzas.length - 1}
            className="rounded-full p-1 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Visualización financiera principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingresos */}
        <FinancialCard
          title="Ingresos"
          value={currentData.ingresos}
          change={incomeChange}
          icon={<DollarSign className="h-6 w-6 text-amber-400" />}
          color="amber"
        />

        {/* Gastos */}
        <FinancialCard
          title="Gastos"
          value={currentData.gastos}
          change={expensesChange}
          icon={<TrendingDown className="h-6 w-6 text-red-400" />}
          color="red"
          progress={calculateProgress(currentData.gastos)}
        />

        {/* Beneficio */}
        <FinancialCard
          title="Beneficio"
          value={currentData.beneficio}
          change={profitChange}
          icon={<TrendingUp className="h-6 w-6 text-green-400" />}
          color="green"
          progress={calculateProgress(currentData.beneficio)}
        />
      </div>
    </div>
  )
}

type FinancialCardProps = {
  title: string
  value: number
  change: number
  icon: React.ReactNode
  color: "amber" | "red" | "green"
  progress?: number
}

function FinancialCard({ title, value, change, icon, color, progress = 100 }: FinancialCardProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)

  const bg = {
    amber: "from-amber-500/20 to-amber-700/20",
    red: "from-red-500/20 to-red-700/20",
    green: "from-green-500/20 to-green-700/20",
  }[color]

  const circleBg = `${color}-500/10`
  const borderColor = `border-${color}-500/20 group-hover:border-${color}-500/40`
  const textColor = `text-${color}-400`
  const fillColor = `from-${color}-400 to-${color}-600`

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg} p-6 backdrop-blur-sm border ${borderColor} group transition-all duration-300`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-${circleBg} rounded-full -mr-16 -mt-16 group-hover:bg-${color}-500/20 transition-all duration-300`}
      />
      <div
        className={`absolute bottom-0 left-0 w-24 h-24 bg-${circleBg} rounded-full -ml-12 -mb-12 group-hover:bg-${color}-500/20 transition-all duration-300`}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-${color}-500/20`}>{icon}</div>
          <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
        </div>

        {change !== 0 && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              change > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <div className={`text-3xl font-bold ${textColor} mb-4`}>{formatCurrency(value)}</div>

      <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${fillColor} rounded-full`}
          style={{ width: `${isNaN(progress) ? 0 : progress}%` }}
        />
      </div>
    </div>
  )
}
