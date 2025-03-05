import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaccion {
  id: number
  descripcion: string
  monto: number
  fecha: string
  tipo: "ingreso" | "gasto"
}

const TransaccionesRecientes = ({ transacciones }: { transacciones: Transaccion[] }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-5 shadow-md">
      <h2 className="text-base font-medium text-gray-200 mb-4">Transacciones Recientes</h2>
      <div className="space-y-3">
        {transacciones.map((transaccion) => (
          <div key={transaccion.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-lg ${transaccion.tipo === "ingreso" ? "bg-green-400/10" : "bg-red-400/10"}`}
              >
                {transaccion.tipo === "ingreso" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">{transaccion.descripcion}</p>
                <p className="text-xs text-gray-400">{transaccion.fecha}</p>
              </div>
            </div>
            <p className={`text-sm font-medium ${transaccion.tipo === "ingreso" ? "text-green-400" : "text-red-400"}`}>
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(transaccion.monto)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransaccionesRecientes

