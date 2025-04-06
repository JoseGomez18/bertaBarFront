"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, ArrowLeft, Save } from "lucide-react"

type IncomeFormData = {
  concept: string
  category: string
  amount: number
  date: string
  notes: string
}

const initialData: IncomeFormData = {
  concept: "",
  category: "ventas",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  notes: "",
}

export function IncomeForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<IncomeFormData>(initialData)
  const [categories, setCategories] = useState<string[]>(["ventas", "eventos", "otros"])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el ingreso
    console.log(formData)
    onClose()
  }

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, newCategory.trim().toLowerCase()])
      setFormData({ ...formData, category: newCategory.trim().toLowerCase() })
      setNewCategory("")
      setShowNewCategory(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border/10 bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Registrar Nuevo Ingreso</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Concepto</label>
            <input
              type="text"
              value={formData.concept}
              onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {showNewCategory ? "Nueva Categoría" : "Categoría"}
            </label>

            {!showNewCategory ? (
              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                  title="Agregar nueva categoría"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nombre de la categoría"
                    className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false)
                      setNewCategory("")
                    }}
                    className="flex items-center gap-1 rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Save className="h-4 w-4" />
                    Guardar Categoría
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Monto</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Notas (opcional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-border/10 bg-secondary/30 px-3 py-2 text-foreground"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              Guardar Ingreso
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

