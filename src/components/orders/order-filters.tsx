"use client"

import type React from "react"

import { Calendar, CreditCard, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

type OrderFiltersProps = {
  activeFilters: {
    status: string
    dateRange: string
    paymentMethod: string
    minAmount: string
    maxAmount: string
  }
  setActiveFilters: (filters: any) => void
}

export function OrderFilters({ activeFilters, setActiveFilters }: OrderFiltersProps) {

  useEffect(() => {
    console.log("OrderFilters montado");
  }, []);

  return (
    <div className="rounded-lg border border-border/10 bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Estado del Pedido</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={activeFilters.status === "all"}
              onClick={() => setActiveFilters({ ...activeFilters, status: "all" })}
            >
              Todos
            </FilterButton>
            <FilterButton
              active={activeFilters.status === "pending"}
              onClick={() => setActiveFilters({ ...activeFilters, status: "pending" })}
            >
              Pendientes
            </FilterButton>
            <FilterButton
              active={activeFilters.status === "in_progress"}
              onClick={() => setActiveFilters({ ...activeFilters, status: "in_progress" })}
            >
              En Preparación
            </FilterButton>
            <FilterButton
              active={activeFilters.status === "completed"}
              onClick={() => setActiveFilters({ ...activeFilters, status: "completed" })}
            >
              Completados
            </FilterButton>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Rango de Fecha</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={activeFilters.dateRange === "today"}
              onClick={() => setActiveFilters({ ...activeFilters, dateRange: "today" })}
              icon={<Calendar className="mr-1 h-3 w-3" />}
            >
              Hoy
            </FilterButton>
            <FilterButton
              active={activeFilters.dateRange === "week"}
              onClick={() => setActiveFilters({ ...activeFilters, dateRange: "week" })}
              icon={<Calendar className="mr-1 h-3 w-3" />}
            >
              Última Semana
            </FilterButton>
            <FilterButton
              active={activeFilters.dateRange === "month"}
              onClick={() => setActiveFilters({ ...activeFilters, dateRange: "month" })}
              icon={<Calendar className="mr-1 h-3 w-3" />}
            >
              Este Mes
            </FilterButton>
            <FilterButton
              active={activeFilters.dateRange === "all"}
              onClick={() => setActiveFilters({ ...activeFilters, dateRange: "all" })}
              icon={<Calendar className="mr-1 h-3 w-3" />}
            >
              Todos
            </FilterButton>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Método de Pago</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={activeFilters.paymentMethod === "all"}
              onClick={() => setActiveFilters({ ...activeFilters, paymentMethod: "all" })}
            >
              Todos
            </FilterButton>
            <FilterButton
              active={activeFilters.paymentMethod === "cash"}
              onClick={() => setActiveFilters({ ...activeFilters, paymentMethod: "cash" })}
              icon={<DollarSign className="mr-1 h-3 w-3" />}
            >
              Efectivo
            </FilterButton>
            <FilterButton
              active={activeFilters.paymentMethod === "card"}
              onClick={() => setActiveFilters({ ...activeFilters, paymentMethod: "card" })}
              icon={<CreditCard className="mr-1 h-3 w-3" />}
            >
              Tarjeta
            </FilterButton>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Rango de Monto</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Mínimo"
                value={activeFilters.minAmount}
                onChange={(e) => setActiveFilters({ ...activeFilters, minAmount: e.target.value })}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Máximo"
                value={activeFilters.maxAmount}
                onChange={(e) => setActiveFilters({ ...activeFilters, maxAmount: e.target.value })}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterButton({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

