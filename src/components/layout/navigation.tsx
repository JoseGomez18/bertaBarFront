"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, ClipboardList, Home, Package, Settings, Users, Wine } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="w-16 flex-shrink-0 overflow-y-auto border-r border-border/10 bg-card/50 backdrop-blur-xl md:w-64">
      <div className="flex h-16 items-center gap-2 border-b border-border/10 px-4">
        <Wine className="h-8 w-8 text-primary" />
        <span className="hidden text-lg font-semibold text-primary md:inline">punto cervecero cold</span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <NavSection title="General" />
        <NavItem href="/" icon={Home} label="Dashboard" active={pathname === "/"} />
        <NavItem href="/orders" icon={ClipboardList} label="Pedidos" active={pathname === "/orders"} />

        <NavSection title="Gestión" />
        <NavItem href="/inventory" icon={Package} label="Inventario" active={pathname === "/inventory"} />
        <NavItem href="/fiados" icon={Users} label="Fiados" active={pathname === "/fiados"} />

        <NavSection title="Análisis" />
        <NavItem href="/finanzas" icon={BarChart} label="finanzas" active={pathname === "/finanzas"} />

        <NavSection title="Sistema" />
        <NavItem href="/settings" icon={Settings} label="Configuración" active={pathname === "/settings"} />
      </div>
    </nav>
  )
}

function NavSection({ title }: { title: string }) {
  return (
    <div className="mt-4 mb-2">
      <h3 className="hidden px-2 text-xs font-semibold text-muted-foreground md:block">{title}</h3>
    </div>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors
        ${active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent hover:text-primary"}
      `}
    >
      <Icon className="h-5 w-5" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}

