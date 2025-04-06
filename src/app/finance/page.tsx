"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Plus, Search } from "lucide-react"
import { FinanceOverview } from "../../components/finance/finance-overview"
import { MonthlySummary } from "../../components/finance/monthly-summary"
import { ExpenseList } from "../../components/finance/expense-list"
import { TransactionHistory } from "../../components/finance/transaction-history"
import { ExpenseForm } from "../../components/finance/expense-form"
import { IncomeForm } from "../../components/finance/income-form"

export default function FinancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState("month")
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [isAddingIncome, setIsAddingIncome] = useState(false)

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">Finanzas</h1>
          <p className="text-muted-foreground">Gestión financiera del bar</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDateRange("month")}
            className={`flex items-center gap-2 rounded-lg border border-border/10 px-3 py-2 text-sm font-medium transition-colors ${
              dateRange === "month"
                ? "bg-accent text-primary"
                : "bg-secondary/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Este Mes
          </button>

          <button className="flex items-center gap-2 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
            <Download className="h-4 w-4" />
            Exportar
          </button>

          <button
            onClick={() => setIsAddingIncome(true)}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Registrar Ingreso
          </button>

          <button
            onClick={() => setIsAddingExpense(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Registrar Gasto
          </button>
        </div>
      </div>

      {/* Resumen financiero */}
      <FinanceOverview />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resumen mensual */}
        <MonthlySummary />

        {/* Lista de gastos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Gastos Recientes</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar gastos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-lg p-2 ${
                  showFilters ? "bg-accent text-primary" : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
          <ExpenseList searchQuery={searchQuery} />
        </div>
      </div>

      {/* Historial de transacciones */}
      <TransactionHistory />

      {isAddingIncome && <IncomeForm onClose={() => setIsAddingIncome(false)} />}
      {isAddingExpense && <ExpenseForm onClose={() => setIsAddingExpense(false)} />}
    </div>
  )
}

