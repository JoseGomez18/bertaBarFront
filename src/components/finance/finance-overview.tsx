"use client"

import { ArrowDown, ArrowUp, DollarSign, TrendingDown, TrendingUp } from "lucide-react"

export function FinanceOverview() {
  // Datos de ejemplo - En una aplicación real vendrían de una API o base de datos
  const financialData = [
    {
      title: "Ingresos Totales",
      value: "$12,845.50",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Gastos Totales",
      value: "$4,320.75",
      change: "+2.4%",
      trend: "up",
      icon: TrendingDown,
    },
    {
      title: "Beneficio Neto",
      value: "$8,524.75",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Margen de Beneficio",
      value: "66.4%",
      change: "+4.2%",
      trend: "up",
      icon: ArrowUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {financialData.map((item, index) => (
        <div key={index} className="glass-effect rounded-xl p-4 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-primary/10 p-2">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                item.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {item.change}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

