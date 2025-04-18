"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, CreditCard, DollarSign } from "lucide-react"

// Datos de ejemplo - En una aplicación real vendrían de una base de datos
const SAMPLE_TRANSACTIONS = [
  {
    id: 1,
    description: "Venta Mesa 8",
    amount: 49.0,
    type: "income",
    date: "2024-03-06",
    time: "20:15",
    paymentMethod: "card",
  },
  {
    id: 2,
    description: "Compra de bebidas",
    amount: 1250.0,
    type: "expense",
    date: "2024-03-05",
    time: "14:30",
    paymentMethod: "transfer",
  },
  {
    id: 3,
    description: "Venta Mesa 4",
    amount: 32.5,
    type: "income",
    date: "2024-03-05",
    time: "21:45",
    paymentMethod: "cash",
  },
  {
    id: 4,
    description: "Pago de servicios",
    amount: 320.5,
    type: "expense",
    date: "2024-03-04",
    time: "10:20",
    paymentMethod: "transfer",
  },
  {
    id: 5,
    description: "Venta Barra 2",
    amount: 78.25,
    type: "income",
    date: "2024-03-04",
    time: "22:10",
    paymentMethod: "card",
  },
  {
    id: 6,
    description: "Salarios personal",
    amount: 2400.0,
    type: "expense",
    date: "2024-03-03",
    time: "09:00",
    paymentMethod: "transfer",
  },
  {
    id: 7,
    description: "Venta Mesa 6",
    amount: 54.0,
    type: "income",
    date: "2024-03-03",
    time: "20:30",
    paymentMethod: "cash",
  },
  {
    id: 8,
    description: "Mantenimiento",
    amount: 150.0,
    type: "expense",
    date: "2024-03-02",
    time: "11:15",
    paymentMethod: "cash",
  },
]

export function TransactionHistory() {
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionType, setTransactionType] = useState("all")
  const itemsPerPage = 5

  // Filtrar por tipo de transacción
  const filteredTransactions =
    transactionType === "all"
      ? SAMPLE_TRANSACTIONS
      : SAMPLE_TRANSACTIONS.filter((transaction) => transaction.type === transactionType)

  // Paginación
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="rounded-xl border border-border/10 bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Historial de Transacciones</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTransactionType("all")}
            className={`rounded-lg px-3 py-1 text-xs font-medium ${
              transactionType === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setTransactionType("income")}
            className={`rounded-lg px-3 py-1 text-xs font-medium ${
              transactionType === "income"
                ? "bg-green-500/20 text-green-500"
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setTransactionType("expense")}
            className={`rounded-lg px-3 py-1 text-xs font-medium ${
              transactionType === "expense"
                ? "bg-red-500/20 text-red-500"
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/10">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Descripción</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Fecha</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Método</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Monto</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-border/10 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full p-1 ${
                        transaction.type === "income" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                  {transaction.date} <span className="text-xs">{transaction.time}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {transaction.paymentMethod === "cash" ? (
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                    ) : transaction.paymentMethod === "card" ? (
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Trans.</span>
                    )}
                    <span className="text-xs text-muted-foreground capitalize">
                      {transaction.paymentMethod === "cash"
                        ? "Efectivo"
                        : transaction.paymentMethod === "card"
                          ? "Tarjeta"
                          : "Transferencia"}
                    </span>
                  </div>
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    transaction.type === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {filteredTransactions.length > itemsPerPage && (
        <div className="flex items-center justify-between border-t border-border/10 px-4 py-3 mt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {Math.min(filteredTransactions.length, (currentPage - 1) * itemsPerPage + 1)} a{" "}
            {Math.min(filteredTransactions.length, currentPage * itemsPerPage)} de {filteredTransactions.length}{" "}
            transacciones
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-border/10 bg-secondary/30 px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-border/10 bg-secondary/30 px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

