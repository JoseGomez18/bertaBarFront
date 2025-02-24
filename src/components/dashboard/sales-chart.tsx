"use client"

import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Mon", sales: 2400 },
  { date: "Tue", sales: 1398 },
  { date: "Wed", sales: 9800 },
  { date: "Thu", sales: 3908 },
  { date: "Fri", sales: 4800 },
  { date: "Sat", sales: 3800 },
  { date: "Sun", sales: 4300 },
]

export function SalesChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Weekly Sales</h3>
      <div className="h-[300px]">
        <ChartContainer
          config={{
            sales: {
              label: "Sales",
              color: "hsl(var(--primary))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="sales" strokeWidth={2} dot={false} stroke="var(--color-sales)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}

