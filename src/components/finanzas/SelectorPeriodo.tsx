import type React from "react"

interface SelectorPeriodoProps {
  periodoSeleccionado: string
  setPeriodoSeleccionado: (periodo: string) => void
}

const SelectorPeriodo: React.FC<SelectorPeriodoProps> = ({ periodoSeleccionado, setPeriodoSeleccionado }) => {
  return (
    <select
      value={periodoSeleccionado}
      onChange={(e) => setPeriodoSeleccionado(e.target.value)}
      className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
    >
      <option value="hoy">Hoy</option>
      <option value="esta-semana">Esta Semana</option>
      <option value="este-mes">Este Mes</option>
      <option value="este-año">Este Año</option>
    </select>
  )
}

export default SelectorPeriodo

