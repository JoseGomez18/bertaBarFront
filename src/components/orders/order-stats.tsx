"use client"

import { ArrowDown, ArrowUp, DollarSign, ShoppingBag, Users } from "lucide-react"

export function OrderStats() {
  // Datos de ejemplo - En una aplicación real vendrían de una API o base de datos
  const stats = [
    {
      title: "Ventas del día",
      value: "$3,240.50",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Pedidos completados",
      value: "24",
      change: "+8.3%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Ticket promedio",
      value: "$135.02",
      change: "+4.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Clientes nuevos",
      value: "8",
      change: "-2.1%",
      trend: "down",
      icon: Users,
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

