import type React from "react"
import { AlertTriangle, Info, TrendingUp, TrendingDown } from "lucide-react"

interface Alerta {
  tipo: "warning" | "info" | "success" | "danger"
  mensaje: string
}

interface AlertasProps {
  alertas: Alerta[]
}

const Alertas: React.FC<AlertasProps> = ({ alertas }) => {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      case "success":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "danger":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getBackgroundColor = (tipo: string) => {
    switch (tipo) {
      case "warning":
        return "bg-yellow-950/50"
      case "info":
        return "bg-blue-950/50"
      case "success":
        return "bg-green-950/50"
      case "danger":
        return "bg-red-950/50"
      default:
        return "bg-blue-950/50"
    }
  }

  return (
    <div className="space-y-2">
      {alertas.map((alerta, index) => (
        <div key={index} className={`flex items-center p-3 rounded-lg ${getBackgroundColor(alerta.tipo)}`}>
          <span className="mr-3">{getIcon(alerta.tipo)}</span>
          <p className="text-sm">{alerta.mensaje}</p>
        </div>
      ))}
    </div>
  )
}

export default Alertas

