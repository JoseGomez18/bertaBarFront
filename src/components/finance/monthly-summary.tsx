"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Datos de ejemplo - En una aplicación real vendrían de una API o base de datos
const MONTHLY_DATA = [
  {
    month: "Enero",
    income: 10250.75,
    expenses: 3850.25,
    profit: 6400.5,
    categories: {
      ventas: 10250.75,
      inventario: 2200.0,
      servicios: 450.25,
      personal: 1200.0,
    },
  },
  {
    month: "Febrero",
    income: 11450.5,
    expenses: 4120.3,
    profit: 7330.2,
    categories: {
      ventas: 11450.5,
      inventario: 2350.0,
      servicios: 470.3,
      personal: 1300.0,
    },
  },
  {
    month: "Marzo",
    income: 12845.5,
    expenses: 4320.75,
    profit: 8524.75,
    categories: {
      ventas: 12845.5,
      inventario: 2500.0,
      servicios: 520.75,
      personal: 1300.0,
    },
  },
]

export function MonthlySummary() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(2) // Marzo por defecto
  const currentData = MONTHLY_DATA[currentMonthIndex]

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonthIndex < MONTHLY_DATA.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1)
    }
  }

  // Calcular porcentajes para las barras de visualización
  const incomePercentage = 100
  const expensesPercentage = (currentData.expenses / currentData.income) * 100
  const profitPercentage = (currentData.profit / currentData.income) * 100

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Resumen Mensual</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            disabled={currentMonthIndex === 0}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary/30 hover:text-foreground disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium">{currentData.month}</span>
          <button
            onClick={handleNextMonth}
            disabled={currentMonthIndex === MONTHLY_DATA.length - 1}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary/30 hover:text-foreground disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Visualización de barras */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Ingresos</span>
              <span className="font-medium">${currentData.income.toFixed(2)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary/30">
              <div className="h-full rounded-full bg-primary" style={{ width: `${incomePercentage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Gastos</span>
              <span className="font-medium text-red-500">${currentData.expenses.toFixed(2)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary/30">
              <div className="h-full rounded-full bg-red-500" style={{ width: `${expensesPercentage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Beneficio</span>
              <span className="font-medium text-green-500">${currentData.profit.toFixed(2)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary/30">
              <div className="h-full rounded-full bg-green-500" style={{ width: `${profitPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Desglose de categorías */}
        {/* <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Desglose de Gastos</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/10 bg-secondary/30 p-3">
              <div className="text-xs text-muted-foreground mb-1">Inventario</div>
              <div className="font-medium">${currentData.categories.inventario.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((currentData.categories.inventario / currentData.expenses) * 100).toFixed(1)}% del total
              </div>
            </div>

            <div className="rounded-lg border border-border/10 bg-secondary/30 p-3">
              <div className="text-xs text-muted-foreground mb-1">Servicios</div>
              <div className="font-medium">${currentData.categories.servicios.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((currentData.categories.servicios / currentData.expenses) * 100).toFixed(1)}% del total
              </div>
            </div>

            <div className="rounded-lg border border-border/10 bg-secondary/30 p-3">
              <div className="text-xs text-muted-foreground mb-1">Personal</div>
              <div className="font-medium">${currentData.categories.personal.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((currentData.categories.personal / currentData.expenses) * 100).toFixed(1)}% del total
              </div>
            </div>

            <div className="rounded-lg border border-border/10 bg-secondary/30 p-3">
              <div className="text-xs text-muted-foreground mb-1">Otros</div>
              <div className="font-medium">
                $
                {(
                  currentData.expenses -
                  currentData.categories.inventario -
                  currentData.categories.servicios -
                  currentData.categories.personal
                ).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {(
                  ((currentData.expenses -
                    currentData.categories.inventario -
                    currentData.categories.servicios -
                    currentData.categories.personal) /
                    currentData.expenses) *
                  100
                ).toFixed(1)}
                % del total
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

