import type React from "react"
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  trend = "neutral",
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
  trend?: "up" | "down" | "neutral"
}) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-blue-500",
  }

  const TrendIcon = {
    up: ArrowUp,
    down: ArrowDown,
    neutral: ArrowRight,
  }[trend]

  return (
    <div className="glass-effect rounded-xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <TrendIcon className={`h-5 w-5 ${trendColors[trend]}`} />
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="mt-1 text-2xl font-bold text-foreground">{value}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

