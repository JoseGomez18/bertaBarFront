import type { LucideIcon } from "lucide-react"

interface BalanceTotalProps {
  balance: number
  icon: LucideIcon
}

const BalanceTotal = ({ balance, icon: Icon }: BalanceTotalProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-5 shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gray-700 rounded-lg">
          <Icon className="w-5 h-5 text-green-400" />
        </div>
        <h2 className="text-base font-medium text-gray-200">Balance Total</h2>
      </div>
      <div className="space-y-1">
        <p className="text-xl font-semibold text-green-400">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(balance)}
        </p>
        <p className="text-xs text-gray-400">Actualizado al día de hoy</p>
      </div>
    </div>
  )
}

export default BalanceTotal

