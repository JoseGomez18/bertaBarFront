"use client"

import { Edit, Trash } from "lucide-react"
import { useState } from "react"

// Datos de ejemplo - En una aplicación real vendrían de una base de datos
const SAMPLE_EXPENSES = [
  { id: 1, concept: "Compra de bebidas", category: "inventario", amount: 1250.0, date: "2024-03-05" },
  { id: 2, concept: "Pago de servicios", category: "servicios", amount: 320.5, date: "2024-03-04" },
  { id: 3, concept: "Salarios personal", category: "personal", amount: 2400.0, date: "2024-03-03" },
  { id: 4, concept: "Mantenimiento", category: "mantenimiento", amount: 150.0, date: "2024-03-02" },
  { id: 5, concept: "Publicidad", category: "marketing", amount: 200.25, date: "2024-03-01" },
]

export function ExpenseList({ searchQuery = "" }) {
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES)

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
      setExpenses(expenses.filter((expense) => expense.id !== id))
    }
  }

  const getCategoryStyle = (category: string) => {
    const styles = {
      inventario: "bg-blue-500/20 text-blue-500",
      servicios: "bg-purple-500/20 text-purple-500",
      personal: "bg-green-500/20 text-green-500",
      mantenimiento: "bg-yellow-500/20 text-yellow-500",
      marketing: "bg-pink-500/20 text-pink-500",
      otros: "bg-gray-500/20 text-gray-500",
    }
    return styles[category as keyof typeof styles] || styles.otros
  }

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto ">
      {filteredExpenses.length > 0 ? (
        filteredExpenses.map((expense) => (
          <div key={expense.id} className="rounded-lg border border-border/10 bg-secondary/30 p-4 ">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{expense.concept}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryStyle(expense.category)}`}
                  >
                    {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">{expense.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-red-500">-${expense.amount.toFixed(2)}</span>
                <div className="flex gap-1">
                  <button className="rounded-lg p-1 text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="rounded-lg p-1 text-muted-foreground hover:bg-secondary/50 hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg border border-border/10 bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
          No se encontraron gastos
        </div>
      )}
    </div>
  )
}

