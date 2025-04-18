import { Beer, Wine, Coffee, Pizza } from "lucide-react"

interface VentaCategoria {
  categoria: string
  monto: number
}

const VentasPorCategoria = ({ ventas }: { ventas: VentaCategoria[] }) => {
  const total = ventas.reduce((sum, venta) => sum + venta.monto, 0)

  const getIcon = (categoria: string) => {
    switch (categoria) {
      case "Cervezas":
        return <Beer className="w-4 h-4" />
      case "Licores":
        return <Wine className="w-4 h-4" />
      case "Cócteles":
        return <Coffee className="w-4 h-4" />
      case "Comidas":
        return <Pizza className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-5 shadow-md">
      <h2 className="text-base font-medium text-gray-200 mb-4">Ventas por Categoría</h2>
      <div className="space-y-4">
        {ventas.map((venta, index) => {
          const percentage = (venta.monto / total) * 100
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-700 rounded-lg text-blue-400">{getIcon(venta.categoria)}</div>
                  <span className="text-sm font-medium text-gray-200">{venta.categoria}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-400">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(venta.monto)}
                  </p>
                  <p className="text-xs text-gray-400">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VentasPorCategoria

