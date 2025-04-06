"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Plus, Search } from "lucide-react"
import { FinanceOverview } from "../../components/finance/finance-overview"
import { MonthlySummary } from "../../components/finance/monthly-summary"


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
      </div>

      {/* Resumen financiero */}
      <FinanceOverview />

      <div className="grid gap-6">
        {/* Resumen mensual */}
        <MonthlySummary />
      </div>

    </div>
  )
}

