"use client"

import { ArrowDown, ArrowUp, DollarSign, CreditCard, Wallet } from "lucide-react"

export function OrderStats() {
  // Datos de ejemplo - En una aplicación real vendrían de una API o base de datos
  const stats = [
    {
      title: "Ventas Totales del Día",
      value: "$3,240.50",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Ventas en Efectivo",
      value: "$1,850.25",
      change: "+8.3%",
      trend: "up",
      icon: Wallet,
    },
    {
      title: "Ventas con Tarjeta",
      value: "$1,120.75",
      change: "+15.2%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Ventas por Transferencia",
      value: "$269.50",
      change: "+22.7%",
      trend: "up",
      icon: DollarSign,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="glass-effect rounded-xl p-4 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-primary/10 p-2">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {stat.change}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

