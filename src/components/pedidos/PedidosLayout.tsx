import type React from "react"

const PedidosLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1929] to-[#0F2942]">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Pedidos</h1>
          <p className="text-gray-400">Administra y supervisa todos los pedidos del bar</p>
        </header>
        {children}
      </div>
    </div>
  )
}

export default PedidosLayout

