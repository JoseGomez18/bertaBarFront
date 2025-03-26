import { Check, Clock, AlertCircle } from "lucide-react"

type FiadoStatusProps = {
  status: "pendiente" | "parcial" | "pagado"
}

export function FiadoStatus({ status }: FiadoStatusProps) {
  const statusConfig = {
    pendiente: {
      icon: <AlertCircle className="h-3 w-3" />,
      label: "Pendiente",
      className: "bg-red-500/20 text-red-500 border-red-500/50",
    },
    parcial: {
      icon: <Clock className="h-3 w-3" />,
      label: "Pago Parcial",
      className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    },
    pagado: {
      icon: <Check className="h-3 w-3" />,
      label: "Pagado",
      className: "bg-green-500/20 text-green-500 border-green-500/50",
    },
  }

  const config = statusConfig[status]

  return (
    <div className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  )
}

