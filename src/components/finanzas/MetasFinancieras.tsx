import type React from "react"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

interface Meta {
  nombre: string
  meta: number
  actual: number
}

interface MetasFinancierasProps {
  metas: Meta[]
}

const MetasFinancieras: React.FC<MetasFinancierasProps> = ({ metas }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-5 shadow-md">
      <h2 className="text-base font-medium text-gray-200 mb-4">Metas Financieras</h2>
      <div className="space-y-4">
        {metas.map((meta, index) => {
          const porcentaje = (meta.actual / meta.meta) * 100
          const isNegativeMeta = meta.nombre.toLowerCase().includes("gasto")

          const getStatusColor = () => {
            if (isNegativeMeta) {
              return porcentaje > 100 ? "text-red-400" : "text-green-400"
            }
            return porcentaje >= 100 ? "text-green-400" : "text-blue-400"
          }

          const getStatusIcon = () => {
            if (isNegativeMeta) {
              if (porcentaje > 100) return <XCircle className="w-4 h-4 text-red-400" />
              if (porcentaje > 90) return <AlertCircle className="w-4 h-4 text-yellow-400" />
              return <CheckCircle2 className="w-4 h-4 text-green-400" />
            } else {
              if (porcentaje >= 100) return <CheckCircle2 className="w-4 h-4 text-green-400" />
              if (porcentaje >= 90) return <AlertCircle className="w-4 h-4 text-yellow-400" />
              return <XCircle className="w-4 h-4 text-red-400" />
            }
          }

          return (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-200">{meta.nombre}</h3>
                    {getStatusIcon()}
                  </div>
                  <div className="mt-1 space-x-1">
                    <span className={`text-sm font-medium ${getStatusColor()}`}>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(meta.actual)}
                    </span>
                    <span className="text-xs text-gray-400">
                      de{" "}
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(meta.meta)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400">{porcentaje.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isNegativeMeta
                      ? porcentaje > 100
                        ? "bg-red-500"
                        : "bg-green-500"
                      : porcentaje >= 100
                        ? "bg-green-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetasFinancieras

