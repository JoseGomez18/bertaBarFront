"use client"

import type React from "react"

import { useState } from "react"
import { Clock, Search, User, ChevronRight } from "lucide-react"
import { FiadoStatus } from "./fiado-status"

type FiadoAccount = {
  id: string
  nombre: string
  total: number
  fechaCreacion: Date
  ultimaActualizacion: Date
  estado: "pendiente" | "parcial" | "pagado"
  pedidos: {
    id: string
    fecha: Date
    total: number
    pagado: number
    productos: {
      productId: number
      producto: string
      cantidad: number
      precio: number
    }[]
  }[]
}

// Datos de ejemplo
const fiadosData: FiadoAccount[] = [
  {
    id: "F001",
    nombre: "Carlos Rodríguez",
    total: 78.5,
    fechaCreacion: new Date(2023, 6, 15),
    ultimaActualizacion: new Date(2023, 6, 18),
    estado: "pendiente",
    pedidos: [
      {
        id: "P1001",
        fecha: new Date(2023, 6, 15),
        total: 45.0,
        pagado: 0,
        productos: [
          { productId: 1, producto: "Hamburguesa Especial", cantidad: 2, precio: 12.5 },
          { productId: 2, producto: "Cerveza Artesanal", cantidad: 4, precio: 5.0 },
        ],
      },
      {
        id: "P1002",
        fecha: new Date(2023, 6, 18),
        total: 33.5,
        pagado: 0,
        productos: [
          { productId: 3, producto: "Alitas BBQ", cantidad: 1, precio: 18.5 },
          { productId: 4, producto: "Refresco", cantidad: 3, precio: 5.0 },
        ],
      },
    ],
  },
  {
    id: "F002",
    nombre: "María González",
    total: 120.0,
    fechaCreacion: new Date(2023, 6, 10),
    ultimaActualizacion: new Date(2023, 6, 17),
    estado: "parcial",
    pedidos: [
      {
        id: "P2001",
        fecha: new Date(2023, 6, 10),
        total: 85.0,
        pagado: 50.0,
        productos: [
          { productId: 5, producto: "Parrillada Mixta", cantidad: 1, precio: 65.0 },
          { productId: 6, producto: "Vino Tinto", cantidad: 1, precio: 20.0 },
        ],
      },
      {
        id: "P2002",
        fecha: new Date(2023, 6, 17),
        total: 35.0,
        pagado: 0,
        productos: [
          { productId: 7, producto: "Ensalada César", cantidad: 1, precio: 15.0 },
          { productId: 8, producto: "Postre del Día", cantidad: 2, precio: 10.0 },
        ],
      },
    ],
  },
  {
    id: "F003",
    nombre: "Juan Pérez",
    total: 45.0,
    fechaCreacion: new Date(2023, 6, 20),
    ultimaActualizacion: new Date(2023, 6, 20),
    estado: "pendiente",
    pedidos: [
      {
        id: "P3001",
        fecha: new Date(2023, 6, 20),
        total: 45.0,
        pagado: 0,
        productos: [
          { productId: 9, producto: "Pizza Familiar", cantidad: 1, precio: 30.0 },
          { productId: 10, producto: "Refresco Familiar", cantidad: 1, precio: 15.0 },
        ],
      },
    ],
  },
]

type FiadoListProps = {
  onSelectFiado: (fiado: FiadoAccount) => void
}

export function FiadoList({ onSelectFiado }: FiadoListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFiados, setFilteredFiados] = useState<FiadoAccount[]>(fiadosData)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredFiados(fiadosData)
    } else {
      const filtered = fiadosData.filter((fiado) => fiado.nombre.toLowerCase().includes(term.toLowerCase()))
      setFilteredFiados(filtered)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full rounded-lg border border-gray-700 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
          style={{ backgroundColor: "#131c31" }}
        />
      </div>

      <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ backgroundColor: "#131c31" }}>
        <div className="px-4 py-3 text-sm font-medium text-white" style={{ backgroundColor: "#131c31" }}>
          Cuentas por Cobrar
        </div>

        {filteredFiados.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No se encontraron cuentas</div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredFiados.map((fiado) => (
              <div
                key={fiado.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-opacity-50 cursor-pointer transition-colors hover:bg-[#1a253d]"
                style={{ backgroundColor: "#131c31" }}
                onClick={() => onSelectFiado(fiado)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: "#1a253d" }}
                  >
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{fiado.nombre}</h3>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Última actualización: {formatDate(fiado.ultimaActualizacion)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-orange-500">${fiado.total.toFixed(2)}</div>
                    <FiadoStatus status={fiado.estado} />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

