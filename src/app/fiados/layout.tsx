import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fiados - Panel de Control",
  description: "Gestión de cuentas por cobrar",
}

export default function FiadosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#090f1e" }}>
      {children}
    </div>
  )
}

